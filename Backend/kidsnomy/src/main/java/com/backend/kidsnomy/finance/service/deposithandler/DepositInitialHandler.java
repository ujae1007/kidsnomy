package com.backend.kidsnomy.finance.service.deposithandler;

import com.backend.kidsnomy.basic.entity.BasicAccount;
import com.backend.kidsnomy.basic.repository.BasicAccountRepository;
import com.backend.kidsnomy.common.exception.ExternalApiException;
import com.backend.kidsnomy.common.service.UserKeyService;
import com.backend.kidsnomy.common.util.ApiUtils;
import com.backend.kidsnomy.finance.entity.*;
import com.backend.kidsnomy.finance.exception.InsufficientBalanceException;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
@Service
public class DepositInitialHandler {
    private final DepositContractRepository depositContractRepository;
    private final BasicAccountRepository basicAccountRepository;
    private final DepositLogRepository depositLogRepository;
    private final UserRepository userRepository;
    private final UserKeyService userKeyService;
    private final RestTemplate restTemplate;
    private final String apiKey;
    private final String baseUrl;

    public DepositInitialHandler(
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
     * [1-1. 예금 계약 직후 목돈 입금 처리]
     * - 계약 생성 후 초기 금액을 아이 계좌에서 예금 계좌로 이체합니다.
     */
    @Transactional
    public void processSingle(Long contractId) {
        DepositContract contract = depositContractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("예금 계약을 찾을 수 없습니다."));

        // 1. 아이 계좌 조회
        BasicAccount childAccount = basicAccountRepository.findFirstByUserId(contract.getUserId())
                .orElseThrow(() -> new NoBasicAccountException("아이 계좌가 없습니다."));

        // 2. 초기 금액 조회 (계약 생성 시 입력된 금액)
        BigDecimal initialAmount = contract.getBalance();

        // 3. 잔액 검증
        if (childAccount.getBalance().compareTo(initialAmount) < 0) {
            throw new InsufficientBalanceException("아이 계좌 잔액이 부족합니다.");
        }

        // 4. 외부 API 호출 (아이 계좌 → 예금 계좌)
        Map<String, Object> requestBody = buildApiRequest(contract, childAccount, initialAmount);
        ResponseEntity<Map> response = executeApiCall(requestBody, contract.getUserId());

        // 5. 잔액 업데이트
        childAccount.setBalance(childAccount.getBalance().subtract(initialAmount));
        contract.setBalance(initialAmount); // 예금 계좌 잔액 설정
        basicAccountRepository.save(childAccount);
        depositContractRepository.save(contract);

        // 6. 거래 로그 기록
        saveTransactionLogs(response.getBody(), initialAmount);
    }

    private Map<String, Object> buildApiRequest(
            DepositContract contract,
            BasicAccount childAccount,
            BigDecimal amount
    ) {
        String userKey = userKeyService.getUserKeyById(childAccount.getUserId());

        long transactionAmount = amount.multiply(BigDecimal.valueOf(1000)).longValueExact();

        Map<String, Object> header = ApiUtils.createApiRequestHeader(
                "updateDemandDepositAccountTransfer",
                apiKey,
                userKey
        );

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("Header", header);
        requestBody.put("depositAccountNo", contract.getAccountNo()); // 입금계좌: 예금 계좌
        requestBody.put("withdrawalAccountNo", childAccount.getAccountNo()); // 출금계좌: 아이 계좌
        requestBody.put("transactionBalance", transactionAmount);
        requestBody.put("depositTransactionSummary", "예금 초기 입금");
        requestBody.put("withdrawalTransactionSummary", "예금 출금");
        return requestBody;
    }

    private ResponseEntity<Map> executeApiCall(Map<String, Object> requestBody, Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다."));

            HttpEntity<Map<String, Object>> httpEntity = ApiUtils.createHttpEntity(
                    requestBody,
                    userKeyService.getUserKeyByEmail(user.getEmail())
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

    private void saveTransactionLogs(Map<String, Object> responseBody, BigDecimal amount) {
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
            log.setTransactionBalance(amount);
            log.setTransactionSummary((String) rec.get("transactionTypeName"));
            log.setTransactionMemo("예금 목돈 납입");
            depositLogRepository.save(log);
        }
    }
}
