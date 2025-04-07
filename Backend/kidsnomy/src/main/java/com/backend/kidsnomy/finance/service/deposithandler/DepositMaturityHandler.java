package com.backend.kidsnomy.finance.service.deposithandler;

import com.backend.kidsnomy.basic.entity.BasicAccount;
import com.backend.kidsnomy.basic.repository.BasicAccountRepository;
import com.backend.kidsnomy.common.exception.ExternalApiException;
import com.backend.kidsnomy.common.service.UserKeyService;
import com.backend.kidsnomy.common.util.ApiUtils;
import com.backend.kidsnomy.finance.entity.DepositContract;
import com.backend.kidsnomy.finance.entity.DepositLog;
import com.backend.kidsnomy.finance.exception.NoBasicAccountException;
import com.backend.kidsnomy.finance.repository.*;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DepositMaturityHandler {
    private final DepositContractRepository depositContractRepository;
    private final BasicAccountRepository basicAccountRepository;
    private final DepositLogRepository depositLogRepository;
    private final UserRepository userRepository;
    private final UserKeyService userKeyService;
    private final RestTemplate restTemplate;
    private final String apiKey;
    private final String baseUrl;

    public DepositMaturityHandler(
            DepositContractRepository depositContractRepository,
            BasicAccountRepository basicAccountRepository,
            DepositLogRepository depositLogRepository,
            UserRepository userRepository,
            UserKeyService userKeyService,
            RestTemplate restTemplate,
            @Value("${ssafy.api.apiKey}") String apiKey,
            @Value("${ssafy.api.base-url}") String baseUrl
    ) {
        this.depositContractRepository = depositContractRepository;
        this.basicAccountRepository = basicAccountRepository;
        this.depositLogRepository = depositLogRepository;
        this.userRepository = userRepository;
        this.userKeyService = userKeyService;
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    /**
     * [2-3-1. 전체 만기 처리 (스케줄러)]
     * - 매일 00:00:01에 실행되어 만기일(end_day)이 오늘인 모든 계약을 처리합니다.
     */
    @Transactional
    public void processAllMaturities() { // ✅ 메서드명 수정
        depositContractRepository.findByEndDay(LocalDate.now())
                .forEach(this::processSingleMaturity);
    }

    /**
     * [최종 1일분 이자 지급]
     * - 만기 전날 23:59:59에 실행되어 최종 이자를 지급합니다.
     */
    @Transactional
    public void processFinalDayInterest() { // ✅ 메서드명 수정
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        depositContractRepository.findByEndDay(tomorrow)
                .forEach(this::calculateAndTransferFinalInterest);
    }


    /**
     * [2-3-2. 단일 만기 처리]
     * - 원금 + 이자 합산 후 아이 계좌로 이체하고 계좌를 해지합니다.
     */
    @Transactional
    public void processSingleMaturity(DepositContract contract) {
        // 1. 최종 이자 지급 (전날 23:59:59에 실행됨)
        // (DepositScheduler의 processFinalInterest()에서 이미 처리됨)

        BigDecimal totalAmount = contract.getBalance().add(contract.getTotalVolume());

        // 3. 아이 계좌 조회
        BasicAccount childAccount = basicAccountRepository.findFirstByUserId(contract.getUserId())
                .orElseThrow(() -> new NoBasicAccountException("아이 계좌가 없습니다."));

        // 4. 외부 API 호출 (예금 계좌 → 아이 계좌)
        Map<String, Object> requestBody = buildApiRequest(contract, childAccount, totalAmount);
        ResponseEntity<Map> response = executeApiCall(requestBody, contract.getUserId());

        // 5. 잔액 업데이트 및 계좌 해지
        childAccount.setBalance(childAccount.getBalance().add(totalAmount));
        contract.setBalance(BigDecimal.ZERO);
        contract.setTotalVolume(BigDecimal.ZERO);
        contract.setStatus(1); // 해지 상태로 변경
        basicAccountRepository.save(childAccount);
        depositContractRepository.save(contract);

        // 6. 거래 로그 기록
        saveTransactionLogs(response.getBody(), totalAmount, contract);
    }

    private Map<String, Object> buildApiRequest(
            DepositContract contract,
            BasicAccount childAccount,
            BigDecimal totalAmount
    ) {
        User user = userRepository.findById(contract.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        String userKey = userKeyService.getUserKeyByEmail(user.getEmail());
        long transactionAmount = totalAmount.multiply(BigDecimal.valueOf(1000)).longValueExact();

        Map<String, Object> header = ApiUtils.createApiRequestHeader(
                "updateDemandDepositAccountTransfer",
                apiKey,
                userKey
        );

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("Header", header);
        requestBody.put("depositAccountNo", childAccount.getAccountNo()); // 입금계좌: 아이 계좌
        requestBody.put("withdrawalAccountNo", contract.getAccountNo()); // 출금계좌: 적금 계좌
        requestBody.put("transactionBalance", transactionAmount);
        requestBody.put("depositTransactionSummary", "예금 만기 해지");
        requestBody.put("withdrawalTransactionSummary", "예금 원금+이자 출금");
        return requestBody;
    }

    private void calculateAndTransferFinalInterest(DepositContract contract) {
        // 1. 일일 이자 계산 (단리)
        BigDecimal dailyInterest = contract.getBalance()
                .multiply(contract.getDeposit().getInterestRate())
                .divide(BigDecimal.valueOf(365), 2, RoundingMode.HALF_UP);

        // 2. 부모 계좌 조회 (예금 상품 생성자)
        User parentUser = userRepository.findById(contract.getDeposit().getUserId())
                .orElseThrow(() -> new IllegalArgumentException("예금 상품 생성자를 찾을 수 없습니다."));

        BasicAccount parentAccount = basicAccountRepository.findFirstByUserId(parentUser.getId())
                .orElseThrow(() -> new NoBasicAccountException("부모 계좌가 없습니다."));

        // 3. 외부 API 호출 (부모 계좌 → 예금 계좌)
        Map<String, Object> requestBody = buildApiRequest(contract, parentAccount, dailyInterest);
        ResponseEntity<Map> response = executeApiCall(requestBody, parentUser.getId());

        // 4. 잔액 업데이트
        parentAccount.setBalance(parentAccount.getBalance().subtract(dailyInterest));
        contract.setTotalVolume(contract.getTotalVolume().add(dailyInterest));
        basicAccountRepository.save(parentAccount);
        depositContractRepository.save(contract);

        // 5. 거래 로그 기록
        saveTransactionLogs(response.getBody(), dailyInterest, contract);
    }

    // userId를 받는 executeApiCall 오버로딩
    private ResponseEntity<Map> executeApiCall(Map<String, Object> requestBody, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        return executeApiCall(requestBody, user.getEmail()); // ✅ 이메일로 변환
    }

    // ✅ email을 받는 기존 executeApiCall 메서드 유지
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

    private void saveTransactionLogs(Map<String, Object> responseBody, BigDecimal totalAmount, DepositContract contract) {
        List<Map<String, Object>> recList = (List<Map<String, Object>>) responseBody.get("REC");
        if (recList == null || recList.isEmpty()) {
            throw new ExternalApiException("거래 기록이 없습니다.");
        }

        for (Map<String, Object> rec : recList) {
            DepositLog log = new DepositLog();
            log.setTransactionUniqueNo((String) rec.get("transactionUniqueNo"));
            log.setTransactionDate((String) rec.get("transactionDate"));
            log.setTransactionTime((String) rec.get("transactionTime"));
            log.setTransactionType("0".equals(rec.get("transactionType"))); // 입금
            log.setTransactionBalance(totalAmount);
            log.setTransactionSummary((String) rec.get("transactionTypeName"));
            log.setTransactionMemo("예금 만기 처리");
            depositLogRepository.save(log);
        }
    }
}
