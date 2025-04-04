package com.backend.kidsnomy.basic.service;

import com.backend.kidsnomy.basic.dto.*;
import com.backend.kidsnomy.basic.entity.AccountLog;
import com.backend.kidsnomy.basic.entity.BasicAccount;
import com.backend.kidsnomy.basic.exception.AccountCloseException;
import com.backend.kidsnomy.basic.exception.AccountCreationException;
import com.backend.kidsnomy.basic.exception.AccountException;
import com.backend.kidsnomy.basic.exception.AccountNotFoundException;
import com.backend.kidsnomy.basic.repository.AccountLogRepository;
import com.backend.kidsnomy.basic.repository.BasicAccountRepository;
import com.backend.kidsnomy.common.exception.AuthenticationException;
import com.backend.kidsnomy.common.service.UserKeyService;
import com.backend.kidsnomy.common.util.ApiUtils;
import com.backend.kidsnomy.jwt.JwtTokenProvider;
import com.backend.kidsnomy.user.repository.UserRepository;
import com.backend.kidsnomy.basic.repository.BasicProductRepository;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class BasicAccountService {

    private final BasicAccountRepository basicAccountRepository;
    private final RestTemplate restTemplate;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserKeyService userKeyService;
    private final UserRepository userRepository; 
    private final BasicProductRepository basicProductRepository;

    private final String apiKey;
    private final String baseUrl;

    public BasicAccountService(
            BasicProductRepository basicProductRepository,
            BasicAccountRepository basicAccountRepository,
            UserRepository userRepository,
            RestTemplate restTemplate,
            JwtTokenProvider jwtTokenProvider,
            UserKeyService userKeyService,
            @Value("${ssafy.api.apiKey}") String apiKey,
            @Value("${ssafy.api.base-url}") String baseUrl) {
        this.basicProductRepository = basicProductRepository;
        this.basicAccountRepository = basicAccountRepository;
        this.userRepository = userRepository;
        this.restTemplate = restTemplate;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userKeyService = userKeyService;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    // 계좌 생성
    @Transactional
    public BasicAccountResponseDto createAccount(HttpServletRequest request, BasicAccountRequestDto requestDto) {

        String token = jwtTokenProvider.resolveAccessToken(request);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            throw new AuthenticationException("유효하지 않은 토큰입니다.");
        }

        // 이메일 → userId 추출
        String email = jwtTokenProvider.getEmailFromToken(token);
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthenticationException("해당 이메일을 가진 사용자를 찾을 수 없습니다."))
                .getId();

        // 기본 상품(accountTypeUniqueNo) 조회
        String accountTypeUniqueNo = basicProductRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new AccountCreationException("기본 수시입출금 상품이 존재하지 않습니다."))
                .getAccountTypeUniqueNo();

        String userKey = userKeyService.getUserKeyByEmail(email);
        String apiUrl = baseUrl + "/ssafy/api/v1/edu/demandDeposit/createDemandDepositAccount";

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> header = ApiUtils.createApiRequestHeader("createDemandDepositAccount", apiKey, userKey);

        requestBody.put("Header", header);
        requestBody.put("accountTypeUniqueNo", accountTypeUniqueNo);

        try {
            HttpEntity<Map<String, Object>> httpEntity = ApiUtils.createHttpEntity(requestBody, userKey);
            Map<String, Object> response = restTemplate.postForObject(apiUrl, httpEntity, Map.class);

            if (response == null || !response.containsKey("REC")) {
                throw new AccountCreationException("계좌 생성 응답에 필요한 정보가 없습니다.");
            }

            Map<String, Object> rec = (Map<String, Object>) response.get("REC");
            String accountNo = Optional.ofNullable((String) rec.get("accountNo"))
                    .orElseThrow(() -> new AccountCreationException("계좌번호 정보가 없습니다."));

            BasicAccount account = new BasicAccount();
            account.setUserId(userId);
            account.setAccountNo(accountNo);
            account.setAccountPassword(requestDto.getAccountPassword());
            account.setBalance(BigDecimal.ZERO);
            basicAccountRepository.save(account);

            return new BasicAccountResponseDto(accountNo, BigDecimal.ZERO);

        } catch (HttpClientErrorException e) {
            throw new AccountCreationException("SSAFY API 호출 실패: " + e.getResponseBodyAsString());
        } catch (AccountCreationException e) {
            throw e;
        } catch (Exception e) {
            throw new AccountCreationException("계좌 생성 중 오류 발생: " + e.getMessage());
        }
    }

    // 계좌 조회
    public AccountCheckResponseDto retrieveAccount(HttpServletRequest request, AccountCheckRequestDto requestDto) {
        String token = jwtTokenProvider.resolveAccessToken(request);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            throw new AuthenticationException("유효하지 않은 토큰입니다.");
        }

        String email = jwtTokenProvider.getEmailFromToken(token);
        String userKey = userKeyService.getUserKeyByEmail(email);

        String apiUrl = baseUrl + "/ssafy/api/v1/edu/demandDeposit/inquireDemandDepositAccount";

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> header = ApiUtils.createApiRequestHeader("inquireDemandDepositAccount", apiKey, userKey);

        requestBody.put("Header", header);
        requestBody.put("accountNo", requestDto.getAccountNo());

        try {
            HttpEntity<Map<String, Object>> httpEntity = ApiUtils.createHttpEntity(requestBody, userKey);
            Map<String, Object> response = restTemplate.postForObject(apiUrl, httpEntity, Map.class);

            if (response == null || !response.containsKey("REC")) {
                throw new AccountNotFoundException("계좌 조회 응답에 필요한 정보가 없습니다.");
            }

            Map<String, Object> rec = (Map<String, Object>) response.get("REC");

            // accountBalance 추출
            BigDecimal apiBalance = new BigDecimal(Optional.ofNullable(rec.get("accountBalance")).orElse("0").toString());

            // DB 업데이트
            BasicAccount account = basicAccountRepository.findByAccountNo(requestDto.getAccountNo())
                    .orElseThrow(() -> new AccountNotFoundException("해당 계좌를 DB에서 찾을 수 없습니다."));

            account.setBalance(apiBalance);
            basicAccountRepository.save(account);

            // 응답 반환
            return new AccountCheckResponseDto(
                    Optional.ofNullable((String) rec.get("userName")).orElse(""),
                    Optional.ofNullable((String) rec.get("bankCode")).orElse(""),
                    Optional.ofNullable((String) rec.get("accountNo")).orElse(""),
                    apiBalance,
                    Optional.ofNullable((String) rec.get("accountCreatedDate")).orElse(""),
                    Optional.ofNullable((String) rec.get("accountExpiryDate")).orElse(""),
                    Optional.ofNullable((String) rec.get("lastTransactionDate")).orElse(""),
                    Optional.ofNullable((String) rec.get("currency")).orElse("KRW")
            );

        } catch (HttpClientErrorException e) {
            throw new AccountNotFoundException("SSAFY API 호출 실패: " + e.getResponseBodyAsString());
        } catch (AccountNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new AccountNotFoundException("계좌 조회 중 오류 발생: " + e.getMessage());
        }
    }


    // 계좌 해지
    @Transactional
    public AccountCloseResponseDto deleteAccount(HttpServletRequest request, AccountCloseRequestDto requestDto) {
        String token = jwtTokenProvider.resolveAccessToken(request);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            throw new AuthenticationException("유효하지 않은 토큰입니다.");
        }

        String email = jwtTokenProvider.getEmailFromToken(token);
        String userKey = userKeyService.getUserKeyByEmail(email);

        String apiUrl = baseUrl + "/ssafy/api/v1/edu/demandDeposit/deleteDemandDepositAccount";

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> header = ApiUtils.createApiRequestHeader("deleteDemandDepositAccount", apiKey, userKey);

        requestBody.put("Header", header);
        requestBody.put("accountNo", requestDto.getAccountNo());

        if (requestDto.getRefundAccountNo() != null && !requestDto.getRefundAccountNo().isEmpty()) {
            requestBody.put("refundAccountNo", requestDto.getRefundAccountNo());
        }

        try {
            HttpEntity<Map<String, Object>> httpEntity = ApiUtils.createHttpEntity(requestBody, userKey);
            Map<String, Object> response = restTemplate.postForObject(apiUrl, httpEntity, Map.class);

            if (response == null || !response.containsKey("REC")) {
                throw new AccountCloseException("계좌 해지 응답에 필요한 정보가 없습니다.");
            }

            Map<String, Object> rec = (Map<String, Object>) response.get("REC");
            BigDecimal accountBalance = new BigDecimal(Optional.ofNullable(rec.get("accountBalance")).orElse("0").toString());

            basicAccountRepository.deleteByAccountNo(requestDto.getAccountNo());

            return new AccountCloseResponseDto(
                    Optional.ofNullable((String) rec.get("status")).orElse("CLOSED"),
                    Optional.ofNullable((String) rec.get("accountNo")).orElse(""),
                    Optional.ofNullable((String) rec.get("refundAccountNo")).orElse(null),
                    accountBalance
            );

        } catch (HttpClientErrorException e) {
            throw new AccountCloseException("SSAFY API 호출 실패: " + e.getResponseBodyAsString());
        } catch (AccountCloseException e) {
            throw e;
        } catch (Exception e) {
            throw new AccountCloseException("계좌 해지 중 오류 발생: " + e.getMessage());
        }
    }
    
    // 계좌 거래내역 조회
    @Autowired
    private AccountLogRepository accountLogRepository;

    public AccountTransactionResponseDto getAccountLog(HttpServletRequest request, AccountTransactionRequestDto requestDto) {
        String token = jwtTokenProvider.resolveAccessToken(request);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            throw new AuthenticationException("유효하지 않은 토큰입니다.");
        }

        String email = jwtTokenProvider.getEmailFromToken(token);
        String userKey = userKeyService.getUserKeyByEmail(email);

        String apiUrl = baseUrl + "/ssafy/api/v1/edu/demandDeposit/inquireTransactionHistoryList";

        Map<String, Object> header = ApiUtils.createApiRequestHeader("inquireTransactionHistoryList", apiKey, userKey);

        Map<String, Object> body = new HashMap<>();
        body.put("Header", header);
        body.put("accountNo", requestDto.getAccountNo());
        body.put("startDate", requestDto.getStartDate());
        body.put("endDate", requestDto.getEndDate());
        body.put("transactionType", requestDto.getTransactionType());
        body.put("orderByType", requestDto.getOrderByType());

        HttpEntity<Map<String, Object>> httpEntity = ApiUtils.createHttpEntity(body, userKey);

        try {
            Map<String, Object> response = restTemplate.postForObject(apiUrl, httpEntity, Map.class);
            Map<String, Object> rec = (Map<String, Object>) response.get("REC");
            List<Map<String, Object>> list = (List<Map<String, Object>>) rec.get("list");

            List<AccountTransactionResponseDto.TransactionDetail> result = new ArrayList<>();

            for (Map<String, Object> item : list) {
                String transactionUniqueNo = (String) item.get("transactionUniqueNo");
                String transactionAccountNo = (String) item.get("transactionAccountNo");
                String transactionDate = (String) item.get("transactionDate");
                String transactionTime = (String) item.get("transactionTime");

                AccountTransactionResponseDto.TransactionDetail dto = new AccountTransactionResponseDto.TransactionDetail(
                    String.valueOf(item.get("transactionUniqueNo")),
                    transactionDate,
                    transactionTime,
                    (String) item.get("transactionType"),
                    (String) item.get("transactionTypeName"),
                    transactionAccountNo,
                    new BigDecimal(item.get("transactionBalance").toString()),
                    new BigDecimal(item.get("transactionAfterBalance").toString()),
                    (String) item.get("transactionSummary"),
                    (String) item.get("transactionMemo")
                );

                result.add(dto);
               

                // ✅ 저장되어 있으면 저장은 하지 않고 넘어감
                if (accountLogRepository.existsByTransactionUniqueNo(transactionUniqueNo)) {
                    continue;
                }

                AccountLog log = new AccountLog();
                log.setUserId(log.getUserId());
                log.setAccountNo(requestDto.getAccountNo()); // 내 계좌번호
                log.setTransactionAccountNo(transactionAccountNo); // 상대 계좌번호 (null 가능)
                log.setTransactionUniqueNo((String) item.get("transactionUniqueNo"));
                log.setTransactionDate(transactionDate);
                log.setTransactionTime(transactionTime); 
                log.setTransactionType(Integer.parseInt((String) item.get("transactionType")));
                log.setTransactionBalance(new BigDecimal(item.get("transactionBalance").toString()));
                log.setTransactionAfterBalance(new BigDecimal(item.get("transactionAfterBalance").toString()));
                log.setTransactionSummary((String) item.get("transactionSummary"));
                log.setTransactionMemo((String) item.get("transactionMemo"));

                accountLogRepository.save(log);
            }

            if (!result.isEmpty()) {
                BigDecimal latestBalance = result.get(0).getTransactionAfterBalance();

                BasicAccount account = basicAccountRepository.findByAccountNo(requestDto.getAccountNo())
                        .orElseThrow(() -> new AccountNotFoundException("계좌를 찾을 수 없습니다."));

                account.setBalance(latestBalance);
                basicAccountRepository.save(account);
            }
            
            return new AccountTransactionResponseDto(result);

        } catch (Exception e) {
            throw new AccountException("거래내역 조회 실패: " + e.getMessage());
        }
    }


}
