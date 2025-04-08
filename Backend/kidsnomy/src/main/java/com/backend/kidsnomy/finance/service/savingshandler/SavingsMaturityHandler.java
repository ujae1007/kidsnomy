package com.backend.kidsnomy.finance.service.savingshandler;

import com.backend.kidsnomy.basic.entity.BasicAccount;
import com.backend.kidsnomy.basic.repository.BasicAccountRepository;
import com.backend.kidsnomy.common.exception.ExternalApiException;
import com.backend.kidsnomy.common.service.UserKeyService;
import com.backend.kidsnomy.common.util.ApiUtils;
import com.backend.kidsnomy.finance.entity.SavingsContract;
import com.backend.kidsnomy.finance.entity.SavingsLog;
import com.backend.kidsnomy.finance.exception.NoBasicAccountException;
import com.backend.kidsnomy.finance.repository.SavingsContractRepository;
import com.backend.kidsnomy.finance.repository.SavingsLogRepository;
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
import java.util.NoSuchElementException;
@Service
public class SavingsMaturityHandler {
    private final SavingsContractRepository savingsContractRepository;
    private final BasicAccountRepository basicAccountRepository;
    private final SavingsLogRepository savingsLogRepository;
    private final UserKeyService userKeyService;
    private final RestTemplate restTemplate;
    private final String apiKey;
    private final String baseUrl;

    public SavingsMaturityHandler(
            SavingsContractRepository savingsContractRepository,
            BasicAccountRepository basicAccountRepository,
            SavingsLogRepository savingsLogRepository,
            UserKeyService userKeyService,
            RestTemplate restTemplate,
            @Value("${ssafy.api.apiKey}") String apiKey,
            @Value("${ssafy.api.base-url}") String baseUrl
    ) {
        this.savingsContractRepository = savingsContractRepository;
        this.basicAccountRepository = basicAccountRepository;
        this.savingsLogRepository = savingsLogRepository;
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
    public void processAllMaturities() {
        savingsContractRepository.findByEndDay(LocalDate.now())
                .forEach(this::processSingleMaturity);
    }

    /**
     * [2-3-2. 최종 1일분 이자 지급]
     * - 만기 전날 23:59:59에 실행되어 최종 이자를 지급합니다.
     */
    @Transactional
    public void processFinalDayInterest() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        savingsContractRepository.findByEndDay(tomorrow)
                .forEach(contract -> {
                    BigDecimal interest = calculateFinalInterest(contract);
                    transferFinalInterest(contract, interest);
                });
    }

    private BigDecimal calculateFinalInterest(SavingsContract contract) {
        return contract.getBalance()
                .multiply(contract.getSavings().getInterestRate())
                .divide(BigDecimal.valueOf(365), 2, RoundingMode.HALF_UP);
    }

    private void transferFinalInterest(SavingsContract contract, BigDecimal interest) {
        // 부모 계좌 → 적금 계좌 이체 로직 (기존 이자 지급 로직과 유사)
        // ...
    }

    /**
     * [2-3-3. 단일 만기 처리]
     * - 원금 + 이자 합산 후 아이 계좌로 이체하고 계좌를 해지합니다.
     */
    @Transactional
    public void processSingleMaturity(SavingsContract contract) {
        // 1. 최종 이자 지급 (전날 23:59:59에 실행됨)
        // (SavingsScheduler의 processFinalInterest()에서 이미 처리됨)

        // 2. 원금 + 이자 합산
        BigDecimal totalAmount = contract.getBalance().add(contract.getRateVolume());

        // 3. 아이 계좌 조회
        BasicAccount childAccount = basicAccountRepository.findFirstByUserId(contract.getUser().getId())
                .orElseThrow(() -> new NoBasicAccountException("아이 계좌가 없습니다."));

        // 4. 외부 API 호출 (적금 계좌 → 아이 계좌)
        Map<String, Object> requestBody = buildApiRequest(contract, childAccount, totalAmount);
        ResponseEntity<Map> response = executeApiCall(requestBody, contract.getUser().getEmail());

        // 5. 잔액 업데이트 및 계좌 해지
        childAccount.setBalance(childAccount.getBalance().add(totalAmount));
        contract.setBalance(BigDecimal.ZERO);
        contract.setRateVolume(BigDecimal.ZERO);
        contract.setStatus(1); // 해지 상태로 변경
        basicAccountRepository.save(childAccount);
        savingsContractRepository.save(contract);

        // 6. 거래 로그 기록
        saveTransactionLogs(response.getBody(), totalAmount, contract);
    }

    private Map<String, Object> buildApiRequest(
            SavingsContract contract,
            BasicAccount childAccount,
            BigDecimal totalAmount
    ) {
        String userKey = userKeyService.getUserKeyByEmail(contract.getUser().getEmail());
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
        requestBody.put("depositTransactionSummary", "적금 만기 해지");
        requestBody.put("withdrawalTransactionSummary", "적금 원금+이자 출금");
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

    private void saveTransactionLogs(Map<String, Object> responseBody, BigDecimal totalAmount, SavingsContract contract) {
        List<Map<String, Object>> recList = (List<Map<String, Object>>) responseBody.get("REC");
        if (recList == null || recList.isEmpty()) {
            throw new ExternalApiException("거래 기록이 없습니다.");
        }

        for (Map<String, Object> rec : recList) {
            SavingsLog log = new SavingsLog();
            log.setTransactionUniqueNo((String) rec.get("transactionUniqueNo"));
            log.setTransactionDate((String) rec.get("transactionDate"));
            log.setTransactionTime((String) rec.get("transactionTime"));
            log.setTransactionType("1".equals(rec.get("transactionType"))); // 입금
            log.setTransactionBalance(totalAmount);
            log.setTransactionSummary((String) rec.get("transactionTypeName"));
            log.setTransactionMemo("적금 만기 처리");
            savingsLogRepository.save(log);
        }
    }
}
