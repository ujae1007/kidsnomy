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
import com.backend.kidsnomy.common.util.ApiUtils;
import com.backend.kidsnomy.common.service.UserKeyService;

import com.backend.kidsnomy.jwt.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;

<<<<<<< Updated upstream
=======
import org.springframework.beans.factory.annotation.Autowired;
>>>>>>> Stashed changes
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
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

    private final String apiKey;
    private final String baseUrl;

    public BasicAccountService(
            BasicAccountRepository basicAccountRepository,
            RestTemplate restTemplate,
            JwtTokenProvider jwtTokenProvider,
            UserKeyService userKeyService,
            @Value("${ssafy.api.apiKey}") String apiKey,
            @Value("${ssafy.api.base-url}") String baseUrl) {
        this.basicAccountRepository = basicAccountRepository;
        this.restTemplate = restTemplate;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userKeyService = userKeyService;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    // 계좌 생성
    @Transactional
    public BasicAccountResponseDto createAccount(HttpServletRequest request, BasicAccountRequestDto requestDto) {
        System.out.println("✅ 계좌 생성 시작");
        // 1. 토큰에서 이메일 추출 (애플리케이션 인증)
        String token = jwtTokenProvider.resolveAccessToken(request);
        System.out.println("✅ 토큰 추출: " + token);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            System.out.println("🚨 인증 실패: 유효하지 않은 토큰");
            throw new AuthenticationException("유효하지 않은 토큰입니다.");
        }
        String email = jwtTokenProvider.getEmailFromToken(token);
        System.out.println("✅ 인증된 사용자: " + email);

        // 2. 이메일로 userKey 조회 (외부 API용 식별자 획득)
        String userKey = userKeyService.getUserKeyByEmail(email);

        // 3. API 요청 준비 (외부 API 통신)
        String apiUrl = baseUrl + "/ssafy/api/v1/edu/demandDeposit/createDemandDepositAccount";

        // 요청 본문 생성
        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> header = ApiUtils.createApiRequestHeader("createDemandDepositAccount", apiKey, userKey);

        requestBody.put("Header", header);
        requestBody.put("accountTypeUniqueNo", requestDto.getAccountTypeUniqueNo());

        try {
            // 4. HTTP 엔티티 생성 - API 호출  (userKey 사용)
            HttpEntity<Map<String, Object>> httpEntity = ApiUtils.createHttpEntity(requestBody, userKey);
            Map<String, Object> response = restTemplate.postForObject(apiUrl, httpEntity, Map.class);

            // 응답 처리
            if (response == null || !response.containsKey("REC")) {
                throw new AccountCreationException("계좌 생성 응답에 필요한 정보가 없습니다.");
            }

            Map<String, Object> rec = (Map<String, Object>) response.get("REC");
            String accountNo  = Optional.ofNullable((String) rec.get("accountNo"))
                    .orElseThrow(() -> new AccountCreationException("계좌번호 정보가 없습니다."));

            // 계좌 정보 저장
            BasicAccount account = BasicAccount.builder()
                    .userId(requestDto.getUserId())
                    .accountNo(accountNo)
                    .accountPassword(requestDto.getAccountPassword())
                    .balance(BigDecimal.ZERO)
                    .build();

            basicAccountRepository.save(account);

            // 응답 생성
            return BasicAccountResponseDto.builder()
                    .accountNo(accountNo)
                    .balance(BigDecimal.ZERO)
                    .build();

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
        // 1. 토큰에서 이메일 추출
        String token = jwtTokenProvider.resolveAccessToken(request);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            throw new AuthenticationException("유효하지 않은 토큰입니다.");
        }
        String email = jwtTokenProvider.getEmailFromToken(token);

        // 2. 이메일로 userKey 조회
        String userKey = userKeyService.getUserKeyByEmail(email);

        // API 요청 준비
        String apiUrl = baseUrl + "/ssafy/api/v1/edu/demandDeposit/inquireDemandDepositAccount";

        // 요청 본문 생성
        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> header = ApiUtils.createApiRequestHeader("inquireDemandDepositAccount", apiKey, userKey);

        requestBody.put("Header", header);
        requestBody.put("accountNo", requestDto.getAccountNo());

        try {
            // API 호출
            HttpEntity<Map<String, Object>> httpEntity = ApiUtils.createHttpEntity(requestBody, userKey);
            Map<String, Object> response = restTemplate.postForObject(apiUrl, httpEntity, Map.class);

            // 응답 처리
            if (response == null || !response.containsKey("REC")) {
                throw new AccountNotFoundException("계좌 조회 응답에 필요한 정보가 없습니다.");
            }

            Map<String, Object> rec = (Map<String, Object>) response.get("REC");

            // 응답 데이터 변환
            BigDecimal accountBalance = new BigDecimal(Optional.ofNullable(rec.get("accountBalance"))
                    .orElse("0").toString());

            // 응답 생성
            return AccountCheckResponseDto.builder()
                    .user_name(Optional.ofNullable((String) rec.get("userName")).orElse(""))
                    .bankCode(Optional.ofNullable((String) rec.get("bankCode")).orElse(""))
                    .accountNo(Optional.ofNullable((String) rec.get("accountNo")).orElse(""))
                    .accountBalance(accountBalance)
                    .accountCreatedDate(Optional.ofNullable((String) rec.get("accountCreatedDate")).orElse(""))
                    .accountExpiryDate(Optional.ofNullable((String) rec.get("accountExpiryDate")).orElse(""))
                    .lastTransactionDate(Optional.ofNullable((String) rec.get("lastTransactionDate")).orElse(""))
                    .currency(Optional.ofNullable((String) rec.get("currency")).orElse("KRW"))
                    .build();

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
        // JwtTokenProvider 직접 사용
        String token = jwtTokenProvider.resolveAccessToken(request);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            throw new AuthenticationException("유효하지 않은 토큰입니다.");
        }
        String email = jwtTokenProvider.getEmailFromToken(token);

        // 2. 이메일로 userKey 조회
        String userKey = userKeyService.getUserKeyByEmail(email);

        // API 요청 준비
        String apiUrl = baseUrl + "/ssafy/api/v1/edu/demandDeposit/deleteDemandDepositAccount";

        // 요청 본문 생성
        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> header = ApiUtils.createApiRequestHeader("deleteDemandDepositAccount", apiKey, userKey);

        requestBody.put("Header", header);
        requestBody.put("accountNo", requestDto.getAccountNo());

        // 잔액 반환 계좌번호가 있는 경우에만 추가
        if (requestDto.getRefundAccountNo() != null && !requestDto.getRefundAccountNo().isEmpty()) {
            requestBody.put("refundAccountNo", requestDto.getRefundAccountNo());
        }

        try {
            // API 호출
            HttpEntity<Map<String, Object>> httpEntity = ApiUtils.createHttpEntity(requestBody, userKey);
            Map<String, Object> response = restTemplate.postForObject(apiUrl, httpEntity, Map.class);

            // 응답 처리
            if (response == null || !response.containsKey("REC")) {
                throw new AccountCloseException("계좌 해지 응답에 필요한 정보가 없습니다.");
            }

            Map<String, Object> rec = (Map<String, Object>) response.get("REC");

            // 응답 데이터 변환
            BigDecimal accountBalance = new BigDecimal(Optional.ofNullable(rec.get("accountBalance"))
                    .orElse("0").toString());

            // 로컬 DB에서 계좌 정보 삭제
            basicAccountRepository.deleteByAccountNo(requestDto.getAccountNo());

            // 응답 생성
            return AccountCloseResponseDto.builder()
                    .status(Optional.ofNullable((String) rec.get("status")).orElse("CLOSED"))
                    .accountNo(Optional.ofNullable((String) rec.get("accountNo")).orElse(""))
                    .refundAccountNo(Optional.ofNullable((String) rec.get("refundAccountNo")).orElse(null))
                    .accountBalance(accountBalance)
                    .build();

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
                log.setUserId(
                    basicAccountRepository.findByAccountNo(requestDto.getAccountNo())
                        .orElseThrow(() -> new AccountNotFoundException("계좌를 찾을 수 없습니다."))
                        .getUserId()
                );
                log.setAccountNo(requestDto.getAccountNo()); // 내 계좌번호
                log.setTransactionName(transactionAccountNo); // 상대 계좌번호 (null 가능)
                log.setTransactionUniqueNo((String) item.get("transactionUniqueNo"));
                log.setTransactionDate(LocalDate.parse(transactionDate, DateTimeFormatter.ofPattern("yyyyMMdd")).atStartOfDay());
                log.setTransactionTime(LocalTime.parse(transactionTime, DateTimeFormatter.ofPattern("HHmmss")).atDate(LocalDate.now()));
                log.setTransactionType(Integer.parseInt((String) item.get("transactionType")));
                log.setTransactionBalance(new BigDecimal(item.get("transactionBalance").toString()));
                log.setTransactionAfterBalance(new BigDecimal(item.get("transactionAfterBalance").toString()));
                log.setTransactionSummary((String) item.get("transactionSummary"));
                log.setTransactionMemo((String) item.get("transactionMemo"));

                accountLogRepository.save(log);
            }

            return new AccountTransactionResponseDto(result);

        } catch (Exception e) {
            throw new AccountException("거래내역 조회 실패: " + e.getMessage());
        }
    }


}
