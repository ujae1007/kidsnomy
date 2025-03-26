package com.backend.kidsnomy.basic.service;

import com.backend.kidsnomy.basic.dto.BasicAccountRequestDto;
import com.backend.kidsnomy.basic.dto.BasicAccountResponseDto;
import com.backend.kidsnomy.basic.dto.TransactionHistoryResponseDto;
import com.backend.kidsnomy.basic.entity.BasicAccount;
import com.backend.kidsnomy.basic.entity.AccountLog;
import com.backend.kidsnomy.basic.repository.BasicAccountRepository;
import com.backend.kidsnomy.basic.repository.AccountLogRepository;
import com.backend.kidsnomy.common.util.ApiUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BasicAccountService {

    @Autowired
    private BasicAccountRepository basicAccountRepository;

    @Autowired
    private AccountLogRepository accountLogRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${ssafy.api.key}")
    private String apiKey;

    @Value("${ssafy.api.base-url}")
    private String baseUrl;

    /**
     * 수시입출금 계좌 생성
     */
    @Transactional
    public BasicAccountResponseDto createAccount(BasicAccountRequestDto requestDto) {
        // API 요청 준비
        String apiUrl = baseUrl + "/ssafy/api/v1/edu/demandDeposit/createDemandDepositAccount";

        // 요청 본문 생성
        Map<String, Object> requestBody = new HashMap<>();

        // Header 생성
        Map<String, Object> header = ApiUtils.createApiRequestHeader("createDemandDepositAccount", apiKey);
        // userKey 추가 (실제 구현 시 사용자 인증 정보에서 가져와야 함)
        header.put("userKey", "2695628f-11a1-418e-b533-9ae19e0650ec"); // 예시 값
        requestBody.put("Header", header);

        // 요청 데이터 설정
        requestBody.put("accountTypeUniqueNo", requestDto.getAccountTypeUniqueNo());

        // API 호출
        HttpEntity<Map<String, Object>> httpEntity = ApiUtils.createHttpEntity(requestBody);
        Map<String, Object> response = restTemplate.postForObject(apiUrl, httpEntity, Map.class);

        // 응답 처리
        if (response != null && response.containsKey("REC")) {
            Map<String, Object> rec = (Map<String, Object>) response.get("REC");
            String accountNo = (String) rec.get("accountNo");

            // DB에 계좌 정보 저장
            BasicAccount account = new BasicAccount();
            account.setUserId(requestDto.getUserId().intValue());
            account.setAccountNo(accountNo);
            account.setAccountPassword(requestDto.getAccountPassword());
            account.setBalance(BigDecimal.ZERO);
            account.setCreatedAt(LocalDateTime.now());
            basicAccountRepository.save(account);

            // 응답 DTO 생성
            BasicAccountResponseDto responseDto = new BasicAccountResponseDto();
            responseDto.setAccountNo(accountNo);
            responseDto.setAccountBalance("0");
            responseDto.setAccountCreatedDate(account.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
            responseDto.setLastTransactionDate("");

            return responseDto;
        }

        throw new RuntimeException("계좌 생성에 실패했습니다.");
    }

    /**
     * 계좌 조회
     */
    public BasicAccountResponseDto getAccount(String accountNo) {
        // DB에서 계좌 정보 조회
        BasicAccount account = basicAccountRepository.findByAccountNo(accountNo)
                .orElseThrow(() -> new RuntimeException("계좌를 찾을 수 없습니다."));

        // API 요청 준비
        String apiUrl = baseUrl + "/ssafy/api/v1/edu/demandDeposit/inquireDemandDepositAccount";

        // 요청 본문 생성
        Map<String, Object> requestBody = new HashMap<>();

        // Header 생성
        Map<String, Object> header = ApiUtils.createApiRequestHeader("inquireDemandDepositAccount", apiKey);
        header.put("userKey", "2695628f-11a1-418e-b533-9ae19e0650ec"); // 예시 값
        requestBody.put("Header", header);

        // 요청 데이터 설정
        requestBody.put("accountNo", accountNo);

        // API 호출
        HttpEntity<Map<String, Object>> httpEntity = ApiUtils.createHttpEntity(requestBody);
        Map<String, Object> response = restTemplate.postForObject(apiUrl, httpEntity, Map.class);

        // 응답 처리
        if (response != null && response.containsKey("REC")) {
            Map<String, Object> rec = (Map<String, Object>) response.get("REC");

            // 응답 DTO 생성
            BasicAccountResponseDto responseDto = new BasicAccountResponseDto();
            responseDto.setAccountNo((String) rec.get("accountNo"));
            responseDto.setAccountBalance((String) rec.get("accountBalance"));
            responseDto.setAccountCreatedDate((String) rec.get("accountCreatedDate"));
            responseDto.setLastTransactionDate((String) rec.get("lastTransactionDate"));

            return responseDto;
        }

        throw new RuntimeException("계좌 정보를 조회할 수 없습니다.");
    }

    /**
     * 계좌 거래 내역 조회
     */
    public TransactionHistoryResponseDto getTransactionHistory(String accountNo) {
        // DB에서 계좌 정보 조회
        BasicAccount account = basicAccountRepository.findByAccountNo(accountNo)
                .orElseThrow(() -> new RuntimeException("계좌를 찾을 수 없습니다."));

        // 계좌 생성일 조회
        String accountCreatedDate = account.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        // 현재 날짜 조회
        String currentDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        // API 요청 준비
        String apiUrl = baseUrl + "/ssafy/api/v1/edu/demandDeposit/inquireTransactionHistory";

        // 요청 본문 생성
        Map<String, Object> requestBody = new HashMap<>();

        // Header 생성
        Map<String, Object> header = ApiUtils.createApiRequestHeader("inquireTransactionHistoryList", apiKey);
        header.put("userKey", "2695628f-11a1-418e-b533-9ae19e0650ec"); // 예시 값
        requestBody.put("Header", header);

        // 요청 데이터 설정
        requestBody.put("accountNo", accountNo);
        requestBody.put("startDate", accountCreatedDate);
        requestBody.put("endDate", currentDate);
        requestBody.put("transactionType", "A"); // 모든 거래 유형
        requestBody.put("orderByType", "DESC"); // 최근 거래부터

        // API 호출
        HttpEntity<Map<String, Object>> httpEntity = ApiUtils.createHttpEntity(requestBody);
        Map<String, Object> response = restTemplate.postForObject(apiUrl, httpEntity, Map.class);

        // 응답 처리
        if (response != null && response.containsKey("REC")) {
            Map<String, Object> rec = (Map<String, Object>) response.get("REC");
            String totalCount = (String) rec.get("totalCount");
            List<Map<String, Object>> transactionList = (List<Map<String, Object>>) rec.get("list");

            // 거래 내역 저장 (필요한 경우)
            saveTransactionLogs(account.getUserId(), accountNo, transactionList);

            // 응답 DTO 생성
            TransactionHistoryResponseDto responseDto = new TransactionHistoryResponseDto();
            responseDto.setTotalCount(totalCount);

            List<TransactionHistoryResponseDto.TransactionDto> dtoList = new ArrayList<>();
            for (Map<String, Object> transaction : transactionList) {
                TransactionHistoryResponseDto.TransactionDto dto = new TransactionHistoryResponseDto.TransactionDto();
                dto.setTransactionUniqueNo((String) transaction.get("transactionUniqueNo"));
                dto.setTransactionDate((String) transaction.get("transactionDate"));
                dto.setTransactionTime((String) transaction.get("transactionTime"));
                dto.setTransactionType((String) transaction.get("transactionType"));
                dto.setTransactionTypeName((String) transaction.get("transactionTypeName"));
                dto.setTransactionAccountNo((String) transaction.get("transactionAccountNo"));
                dto.setTransactionBalance((String) transaction.get("transactionBalance"));
                dto.setTransactionAfterBalance((String) transaction.get("transactionAfterBalance"));
                dto.setTransactionSummary((String) transaction.get("transactionSummary"));
                dto.setTransactionMemo((String) transaction.get("transactionMemo"));
                dtoList.add(dto);
            }
            responseDto.setList(dtoList);

            return responseDto;
        }

        throw new RuntimeException("거래 내역을 조회할 수 없습니다.");
    }

    /**
     * 거래 내역 저장 (필요한 경우)
     */
    private void saveTransactionLogs(Integer userId, String accountNo, List<Map<String, Object>> transactionList) {
        for (Map<String, Object> transaction : transactionList) {
            String transactionUniqueNo = (String) transaction.get("transactionUniqueNo");

            // 이미 저장된 거래 내역인지 확인
            if (!accountLogRepository.existsByTransactionUniqueNo(transactionUniqueNo)) {
                AccountLog log = new AccountLog();
                log.setUserId(userId);
                log.setAccountNo(accountNo);
                log.setTransactionName((String) transaction.get("transactionTypeName"));
                log.setTransactionUniqueNo(transactionUniqueNo);

                // 날짜와 시간 파싱
                String transactionDate = (String) transaction.get("transactionDate");
                String transactionTime = (String) transaction.get("transactionTime");
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
                LocalDateTime dateTime = LocalDateTime.parse(transactionDate + transactionTime, formatter);

                log.setTransactionDate(dateTime);
                log.setTransactionTime(dateTime);

                // 거래 유형 설정 (1: 입금, 2: 출금)
                log.setTransactionType(Integer.parseInt((String) transaction.get("transactionType")));

                // 금액 설정
                log.setTransactionBalance(new BigDecimal((String) transaction.get("transactionBalance")));
                log.setTransactionAfterBalance(new BigDecimal((String) transaction.get("transactionAfterBalance")));

                accountLogRepository.save(log);
            }
        }
    }
}
