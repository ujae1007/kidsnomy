package com.backend.kidsnomy.finance.service.savingshandler;

import com.backend.kidsnomy.basic.entity.BasicAccount;
import com.backend.kidsnomy.basic.repository.BasicAccountRepository;
import com.backend.kidsnomy.basic.repository.BasicProductRepository;
import com.backend.kidsnomy.common.exception.AuthenticationException;
import com.backend.kidsnomy.common.exception.ExternalApiException;
import com.backend.kidsnomy.common.service.UserKeyService;
import com.backend.kidsnomy.common.util.ApiUtils;
import com.backend.kidsnomy.finance.entity.SavingsContract;
import com.backend.kidsnomy.finance.entity.SavingsLog;
import com.backend.kidsnomy.finance.exception.NoBasicAccountException;
import com.backend.kidsnomy.finance.repository.SavingsContractRepository;
import com.backend.kidsnomy.finance.repository.SavingsLogRepository;
import com.backend.kidsnomy.finance.repository.SavingsRepository;
import com.backend.kidsnomy.group.repository.GroupMembershipRepository;
import com.backend.kidsnomy.jwt.JwtTokenProvider;
import com.backend.kidsnomy.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class SavingsRegularHandler {
    private final BasicProductRepository basicProductRepository;
    private final BasicAccountRepository basicAccountRepository;
    private final SavingsLogRepository savingsLogRepository;
    private final SavingsRepository savingsRepository;
    private final SavingsContractRepository savingsContractRepository;
    private final GroupMembershipRepository groupMembershipRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserKeyService userKeyService;

    private final String apiKey;
    private final String baseUrl;

    public SavingsRegularHandler(BasicProductRepository basicProductRepository,
                                 BasicAccountRepository basicAccountRepository,
                                 SavingsLogRepository savingsLogRepository,
                                 SavingsRepository savingsRepository,
                                 SavingsContractRepository savingsContractRepository,
                                 GroupMembershipRepository groupMembershipRepository,
                                 UserRepository userRepository,
                                 RestTemplate restTemplate,
                                 JwtTokenProvider jwtTokenProvider,
                                 UserKeyService userKeyService,
                                 @Value("${ssafy.api.apiKey}") String apiKey,
                                 @Value("${ssafy.api.base-url}") String baseUrl) {
        this.basicProductRepository = basicProductRepository;
        this.basicAccountRepository = basicAccountRepository;
        this.savingsLogRepository = savingsLogRepository;
        this.savingsRepository = savingsRepository;
        this.savingsContractRepository = savingsContractRepository;
        this.groupMembershipRepository = groupMembershipRepository;
        this.userRepository = userRepository;
        this.restTemplate = restTemplate;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userKeyService = userKeyService;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    // 1-1. 전체 정기 납입 처리 (스케줄러)
    @Transactional
    public void processAllRegularSavings(int todayDay) {
        savingsContractRepository.findByStatusAndSavings_PayDate(0, todayDay)
                .forEach(this::processSingleRegularSavings);
    }

    // 1-2. 단일 정기 납입 처리 (내부 공통 로직)
    @Transactional
    public void processSingleRegularSavings(SavingsContract contract) {
        // 4. 사용자의 기본 계좌 조회
        BasicAccount basicAccount = basicAccountRepository.findFirstByUserId(contract.getUser().getId())
                .orElseThrow(() -> new NoBasicAccountException("기본 계좌가 없습니다."));


        // 5. 외부 API 요청 구성
        String userKey = userKeyService.getUserKeyByEmail(contract.getUser().getEmail());
        String apiUrl = baseUrl + "/ssafy/api/v1/edu/demandDeposit/updateDemandDepositAccountTransfer";

        Map<String, Object> header = ApiUtils.createApiRequestHeader(
                "updateDemandDepositAccountTransfer",
                apiKey,
                userKey
        );

        long transactionAmount = contract.getOneTimeVolume().multiply(BigDecimal.valueOf(1000)).longValueExact();

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("Header", header);
        requestBody.put("depositAccountNo", contract.getAccountNo()); // 아이 적금 계좌 (입금)
        requestBody.put("withdrawalAccountNo", basicAccount.getAccountNo()); // 아이 기본 계좌 (출금)
        requestBody.put("transactionBalance", transactionAmount); // 정기 납입액
        requestBody.put("depositTransactionSummary", "적금 정기 납입");
        requestBody.put("withdrawalTransactionSummary", "적금 납입금 출금");

        try {
            // 6. API 호출
            HttpEntity<Map<String, Object>> httpEntity = ApiUtils.createHttpEntity(requestBody, userKey);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    apiUrl,
                    httpEntity,
                    Map.class
            );

            // 7. 응답 처리
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new ExternalApiException("HTTP 상태 코드 오류: " + response.getStatusCode());
            }

            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null || !responseBody.containsKey("REC")) {
                throw new ExternalApiException("응답 형식이 올바르지 않습니다.");
            }

            List<Map<String, Object>> recList = (List<Map<String, Object>>) responseBody.get("REC");
            if (recList.isEmpty()) {
                throw new ExternalApiException("거래 기록이 없습니다.");
            }

            // 8. 잔액 업데이트 (기본 계좌와 적금 계좌)
            BigDecimal withdrawalAmount = contract.getOneTimeVolume();

            basicAccount.setBalance(basicAccount.getBalance().subtract(withdrawalAmount)); // 출금 계좌 잔액 감소
            basicAccountRepository.save(basicAccount);

            contract.setBalance(contract.getBalance().add(withdrawalAmount)); // 적금 계좌 잔액 증가
            savingsContractRepository.save(contract);

            // 9. 다중 거래 로그 기록
            for (Map<String, Object> rec : recList) {
                SavingsLog log = new SavingsLog();
                log.setTransactionUniqueNo((String) rec.get("transactionUniqueNo"));
                log.setTransactionDate((String) rec.get("transactionDate"));
                log.setTransactionTime((String) rec.get("transactionTime"));
                log.setTransactionType("1".equals(rec.get("transactionType"))); // 1: 입금, 2: 출금
                log.setTransactionBalance(new BigDecimal((Integer) rec.get("transactionBalance"))
                        .divide(BigDecimal.valueOf(1000), 2, RoundingMode.HALF_UP));
                log.setTransactionSummary((String) rec.get("transactionTypeName"));
                log.setTransactionMemo("적금 정기 납입");
                savingsLogRepository.save(log);
            }
        } catch (HttpClientErrorException e) {
            throw new ExternalApiException("SSAFY API 오류: " + e.getResponseBodyAsString());
        }
    }

    // 1-3. 단일 정기 납입 처리 (API 요청)
    @Transactional
    public void processRegularSavings(Long contractId, HttpServletRequest request) {
        // 1. JWT 인증
        String token = jwtTokenProvider.resolveAccessToken(request);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            throw new IllegalArgumentException("유효하지 않은 토큰입니다.");
        }

        // 2. 사용자 정보 추출
        String email = jwtTokenProvider.getEmailFromToken(token);
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthenticationException("해당 이메일을 가진 사용자를 찾을 수 없습니다."))
                .getId();

        // 3. 계약 조회 시 사용자 소유 확인
        SavingsContract contract = savingsContractRepository.findByIdAndUserId(contractId, userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 계약을 찾을 수 없거나 권한이 없습니다."));

        // 실제 처리 로직 호출
        processSingleRegularSavings(contract);
    }
}
