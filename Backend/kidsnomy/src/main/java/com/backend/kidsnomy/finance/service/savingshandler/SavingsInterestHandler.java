package com.backend.kidsnomy.finance.service.savingshandler;

import com.backend.kidsnomy.basic.entity.BasicAccount;
import com.backend.kidsnomy.basic.repository.BasicAccountRepository;
import com.backend.kidsnomy.basic.repository.BasicProductRepository;
import com.backend.kidsnomy.common.exception.ExternalApiException;
import com.backend.kidsnomy.common.service.UserKeyService;
import com.backend.kidsnomy.common.util.ApiUtils;
import com.backend.kidsnomy.finance.entity.Savings;
import com.backend.kidsnomy.finance.entity.SavingsContract;
import com.backend.kidsnomy.finance.entity.SavingsLog;
import com.backend.kidsnomy.finance.exception.NoBasicAccountException;
import com.backend.kidsnomy.finance.exception.NoParentInGroupException;
import com.backend.kidsnomy.finance.repository.SavingsContractRepository;
import com.backend.kidsnomy.finance.repository.SavingsLogRepository;
import com.backend.kidsnomy.finance.repository.SavingsRepository;
import com.backend.kidsnomy.group.entity.GroupMembership;
import com.backend.kidsnomy.group.repository.GroupMembershipRepository;
import com.backend.kidsnomy.jwt.JwtTokenProvider;
import com.backend.kidsnomy.user.entity.User;
import com.backend.kidsnomy.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class SavingsInterestHandler {
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

    public SavingsInterestHandler(
            BasicProductRepository basicProductRepository,
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

    // 2-2-1. 전체 이자 지급 처리 (스케줄러)
    @Transactional
    public void processAllInterestPayments(int todayDay) {
        savingsContractRepository.findByStatusAndSavings_RateDate(0, todayDay)
                .forEach(this::processSingle);
    }

    // 2-2-2. 단일 이자 지급 처리
    @Transactional
    public void processSingle(SavingsContract contract) {
        // 1. 자식 사용자 조회 (계약 소유자)
        User childUser = contract.getUser();

        // 2. 적금 상품 생성자(부모 사용자) 조회
        Savings savings = contract.getSavings();
        Long parentUserId = savings.getUserId(); // 적금 상품을 생성한 부모의 ID

        User parentUser = userRepository.findById(parentUserId)
                .orElseThrow(() -> new IllegalArgumentException("적금 상품 생성자를 찾을 수 없습니다."));

        // 3. 부모 계좌 조회
        BasicAccount parentAccount = basicAccountRepository.findFirstByUserId(parentUser.getId())
                .orElseThrow(() -> new NoBasicAccountException("부모 계좌가 없습니다."));

        // 4. 이자 계산 (단리)
        BigDecimal interest = contract.getBalance()
                .multiply(contract.getSavings().getInterestRate())
                .divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);

        // 5. 외부 API 호출 (부모 계좌 → 적금 계좌)
        Map<String, Object> requestBody = buildApiRequest(contract, parentAccount, interest);
        ResponseEntity<Map> response = executeApiCall(requestBody, parentUser.getEmail());

        // 6. 잔액 및 rate_volume 업데이트
        parentAccount.setBalance(parentAccount.getBalance().subtract(interest));
        contract.setRateVolume(contract.getRateVolume().add(interest));
        basicAccountRepository.save(parentAccount);
        savingsContractRepository.save(contract);

        // 7. 거래 로그 기록
        saveTransactionLogs(response.getBody(), interest, contract);
    }


    private Map<String, Object> buildApiRequest(
            SavingsContract contract,
            BasicAccount parentAccount,
            BigDecimal interest
    ) {
        // 부모 사용자 조회 (BasicAccount의 userId 사용)
        User parentUser = userRepository.findById(parentAccount.getUserId())
                .orElseThrow(() -> new NoSuchElementException("부모 사용자를 찾을 수 없습니다."));

        String userKey = userKeyService.getUserKeyByEmail(parentUser.getEmail());
        long transactionAmount = interest.multiply(BigDecimal.valueOf(1000)).longValueExact();

        Map<String, Object> header = ApiUtils.createApiRequestHeader(
                "updateDemandDepositAccountTransfer",
                apiKey,
                userKey
        );

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("Header", header);
        requestBody.put("depositAccountNo", contract.getAccountNo());
        requestBody.put("withdrawalAccountNo", parentAccount.getAccountNo());
        requestBody.put("transactionBalance", transactionAmount);
        requestBody.put("depositTransactionSummary", "적금 이자 지급");
        requestBody.put("withdrawalTransactionSummary", "적금 이자 출금");
        return requestBody;
    }

    private ResponseEntity<Map> executeApiCall(Map<String, Object> requestBody, String email) {
        try {
            HttpEntity<Map<String, Object>> httpEntity = ApiUtils.createHttpEntity(
                    requestBody,
                    userKeyService.getUserKeyByEmail(email)
            );

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    baseUrl + "/ssafy/api/v1/edu/demandDeposit/updateDemandDepositAccountTransfer",
                    httpEntity,
                    Map.class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new ExternalApiException("HTTP 상태 코드 오류: " + response.getStatusCode());
            }
            return response;
        } catch (HttpClientErrorException e) {
            throw new ExternalApiException("SSAFY API 오류: " + e.getResponseBodyAsString());
        }
    }

    private void saveTransactionLogs(Map<String, Object> responseBody, BigDecimal interest, SavingsContract contract) {
        List<Map<String, Object>> recList = (List<Map<String, Object>>) responseBody.get("REC");
        if (recList == null || recList.isEmpty()) {
            throw new ExternalApiException("거래 기록이 없습니다.");
        }

        for (Map<String, Object> rec : recList) {
            SavingsLog log = new SavingsLog();
            log.setTransactionUniqueNo((String) rec.get("transactionUniqueNo"));

            // 1. API 응답에서 거래 일시 추출
            log.setTransactionDate((String) rec.get("transactionDate"));
            log.setTransactionTime((String) rec.get("transactionTime"));

            // 2. 거래 유형 설정 (입금/출금)
            log.setTransactionType("1".equals(rec.get("transactionType")));

            // 3. 거래 금액 및 이후 잔액 설정
            log.setTransactionBalance(interest);
            log.setTransactionAfterBalance(contract.getRateVolume()); // 업데이트된 rate_volume

            // 4. 거래 요약 및 메모 설정
            log.setTransactionSummary((String) rec.get("transactionTypeName"));
            log.setTransactionMemo("적금 이자 지급");

            // 5. 상품 유형 설정 (1: 적금)
            log.setProductType((byte) 1);
            savingsLogRepository.save(log);
        }
    }
}
