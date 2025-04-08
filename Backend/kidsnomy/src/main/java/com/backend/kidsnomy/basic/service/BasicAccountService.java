package com.backend.kidsnomy.basic.service;

import com.backend.kidsnomy.basic.dto.*;
import com.backend.kidsnomy.basic.entity.AccountLog;
import com.backend.kidsnomy.basic.entity.BasicAccount;
import com.backend.kidsnomy.basic.exception.AccountCloseException;
import com.backend.kidsnomy.basic.exception.AccountCreationException;
import com.backend.kidsnomy.basic.exception.AccountException;
import com.backend.kidsnomy.basic.exception.AccountNotFoundException;
import com.backend.kidsnomy.basic.exception.UserNotFoundException;
import com.backend.kidsnomy.basic.repository.AccountLogRepository;
import com.backend.kidsnomy.basic.repository.BasicAccountRepository;
import com.backend.kidsnomy.common.exception.AuthenticationException;
import com.backend.kidsnomy.common.service.UserKeyService;
import com.backend.kidsnomy.common.util.ApiUtils;
import com.backend.kidsnomy.jwt.JwtTokenProvider;
import com.backend.kidsnomy.user.entity.User;
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
import java.time.LocalDate;
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

        // 👉 계좌 생성일 조회해서 startDate 자동 설정
        BasicAccount account = basicAccountRepository.findByAccountNo(requestDto.getAccountNo())
            .orElseThrow(() -> new AccountNotFoundException("계좌를 찾을 수 없습니다."));

        // ✅ 날짜 자동 세팅
        if (requestDto.getStartDate() == null || requestDto.getStartDate().isBlank()) {
            String startDate = account.getCreatedAt().toLocalDate().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            requestDto.setStartDate(startDate);
        }
        if (requestDto.getEndDate() == null || requestDto.getEndDate().isBlank()) {
            String endDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            requestDto.setEndDate(endDate);
        }

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
                    transactionUniqueNo,
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
                log.setUserId(account.getUserId().intValue());
                log.setAccountNo(requestDto.getAccountNo()); // 내 계좌번호
                log.setTransactionAccountNo(transactionAccountNo); // 상대 계좌번호 (null 가능)
                log.setTransactionUniqueNo(transactionUniqueNo);
                log.setTransactionDate(transactionDate);
                log.setTransactionTime(transactionTime);
                log.setTransactionType(Integer.parseInt((String) item.get("transactionType")));
                log.setTransactionBalance(new BigDecimal(item.get("transactionBalance").toString()));
                log.setTransactionAfterBalance(new BigDecimal(item.get("transactionAfterBalance").toString()));
                log.setTransactionSummary((String) item.get("transactionSummary"));
                log.setTransactionMemo((String) item.get("transactionMemo"));

                accountLogRepository.save(log);
            }

            // ✅ 가장 최신 거래 기준으로 잔액 업데이트
            if (!result.isEmpty()) {
                BigDecimal latestBalance = result.get(0).getTransactionAfterBalance();
                account.setBalance(latestBalance);
                basicAccountRepository.save(account);
            }

            return new AccountTransactionResponseDto(result);

        } catch (Exception e) {
            throw new AccountException("거래내역 조회 실패: " + e.getMessage());
        }
    }


    // 계좌 잔액 최신화
    public void refreshBalance(Long userId) {
    	List<BasicAccount> accounts = basicAccountRepository.findByUserId(userId);
    	if (accounts.isEmpty()) {
    	    throw new AccountNotFoundException("사용자의 계좌가 존재하지 않습니다.");
    	}
    	BasicAccount account = accounts.get(0);

        String email = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("사용자 없음")).getEmail();

        String userKey = userKeyService.getUserKeyByEmail(email);
        String apiUrl = baseUrl + "/ssafy/api/v1/edu/demandDeposit/inquireDemandDepositAccount";

        Map<String, Object> header = ApiUtils.createApiRequestHeader("inquireDemandDepositAccount", apiKey, userKey);
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("Header", header);
        requestBody.put("accountNo", account.getAccountNo());

        try {
            HttpEntity<Map<String, Object>> httpEntity = ApiUtils.createHttpEntity(requestBody, userKey);
            Map<String, Object> response = restTemplate.postForObject(apiUrl, httpEntity, Map.class);

            if (response == null || !response.containsKey("REC")) {
                throw new AccountNotFoundException("계좌 조회 응답이 올바르지 않습니다.");
            }

            Map<String, Object> rec = (Map<String, Object>) response.get("REC");
            BigDecimal apiBalance = new BigDecimal(Optional.ofNullable(rec.get("accountBalance")).orElse("0").toString());

            account.setBalance(apiBalance);
            basicAccountRepository.save(account);

        } catch (Exception e) {
            throw new AccountNotFoundException("계좌 잔액 최신화 실패: " + e.getMessage());
        }
    }
    
    // 계좌 상세 조회
    public AccountDetailResponseDto getMyAccountDetail(String email) {
        // 1. 유저 조회
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다."));

        // 2. 계좌 조회
        List<BasicAccount> accounts = basicAccountRepository.findByUserId(user.getId());
        if (accounts.isEmpty()) {
            throw new AccountNotFoundException("사용자의 계좌가 존재하지 않습니다.");
        }
        BasicAccount account = accounts.get(0);

        // 3. 외부 API 호출해서 거래내역 최신화 시도 (저장만 함, 리턴은 안 씀)
        try {
            getAccountLogByEmail(email); // 이 내부에서 DB 저장 처리만 하고 끝냄
        } catch (Exception e) {
            // API 실패해도 무시하고 기존 DB에서 보여주도록
            System.out.println("외부 거래내역 최신화 실패: " + e.getMessage());
        }

        // 4. 이제 우리 DB에서 무조건 조회해서 보여줌
        List<AccountLog> logs = accountLogRepository.findByAccountNoOrderByTransactionDateDescTransactionTimeDesc(account.getAccountNo());
        List<AccountTransactionResponseDto.TransactionDetail> transactions = new ArrayList<>();

        for (AccountLog log : logs) {
            String typeName = log.getTransactionType() == 1 ? "입금" : "출금";

            transactions.add(new AccountTransactionResponseDto.TransactionDetail(
                log.getTransactionUniqueNo(),
                log.getTransactionDate(),
                log.getTransactionTime(),
                String.valueOf(log.getTransactionType()),
                typeName,
                log.getTransactionAccountNo(),
                log.getTransactionBalance(),
                log.getTransactionAfterBalance(),
                log.getTransactionSummary(),
                log.getTransactionMemo()
            ));
        }

        // 5. 응답 조립
        return new AccountDetailResponseDto(
            account.getAccountNo(),
            account.getBalance(),
            account.getCreatedAt(),
            transactions
        );
    }




    
    public AccountTransactionResponseDto getAccountLogByEmail(String email) {
        // 유저 & 계좌 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AccountNotFoundException("사용자를 찾을 수 없습니다."));
        List<BasicAccount> accounts = basicAccountRepository.findByUserId(user.getId());
        if (accounts.isEmpty()) {
            throw new AccountNotFoundException("사용자의 계좌가 존재하지 않습니다.");
        }
        BasicAccount account = accounts.get(0); // 첫 번째 계좌 사용
        
        // 기본 요청 정보 세팅
        AccountTransactionRequestDto requestDto = new AccountTransactionRequestDto();
        requestDto.setAccountNo(account.getAccountNo());
        requestDto.setTransactionType("A");  // 전체
        requestDto.setOrderByType("DESC");

        return getAccountLogInternal(account, requestDto, email);
    }
    
    private AccountTransactionResponseDto getAccountLogInternal(BasicAccount account, AccountTransactionRequestDto requestDto, String email) {
        String userKey = userKeyService.getUserKeyByEmail(email);

        // ✅ 날짜 자동 세팅
        if (requestDto.getStartDate() == null || requestDto.getStartDate().isBlank()) {
            String startDate = account.getCreatedAt().toLocalDate().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            requestDto.setStartDate(startDate);
        } else {
            requestDto.setStartDate(requestDto.getStartDate().replaceAll("-", ""));
        }

        if (requestDto.getEndDate() == null || requestDto.getEndDate().isBlank()) {
            String endDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            requestDto.setEndDate(endDate);
        } else {
            requestDto.setEndDate(requestDto.getEndDate().replaceAll("-", ""));
        }
        // ✅ 거래유형 기본값 "A"
        if (requestDto.getTransactionType() == null || requestDto.getTransactionType().isBlank()) {
            requestDto.setTransactionType("A");
        }

        // ✅ 정렬방식 기본값 "DESC"
        if (requestDto.getOrderByType() == null || requestDto.getOrderByType().isBlank()) {
            requestDto.setOrderByType("DESC");
        }

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

                // 중복 저장 방지
                if (accountLogRepository.existsByTransactionUniqueNo(transactionUniqueNo)) {
                    continue;
                }

                AccountTransactionResponseDto.TransactionDetail dto = new AccountTransactionResponseDto.TransactionDetail(
                    transactionUniqueNo,
                    (String) item.get("transactionDate"),
                    (String) item.get("transactionTime"),
                    (String) item.get("transactionType"),
                    (String) item.get("transactionTypeName"),
                    (String) item.get("transactionAccountNo"),
                    new BigDecimal(item.get("transactionBalance").toString()),
                    new BigDecimal(item.get("transactionAfterBalance").toString()),
                    (String) item.get("transactionSummary"),
                    (String) item.get("transactionMemo")
                );
                result.add(dto);

                AccountLog log = new AccountLog();
                log.setUserId(account.getUserId().intValue());
                log.setAccountNo(account.getAccountNo());
                log.setTransactionAccountNo((String) item.get("transactionAccountNo"));
                log.setTransactionUniqueNo(transactionUniqueNo);
                log.setTransactionDate((String) item.get("transactionDate"));
                log.setTransactionTime((String) item.get("transactionTime"));
                log.setTransactionType(Integer.parseInt((String) item.get("transactionType")));
                log.setTransactionBalance(new BigDecimal(item.get("transactionBalance").toString()));
                log.setTransactionAfterBalance(new BigDecimal(item.get("transactionAfterBalance").toString()));
                log.setTransactionSummary((String) item.get("transactionSummary"));
                log.setTransactionMemo((String) item.get("transactionMemo"));

                accountLogRepository.save(log);
            }

            // 최신 거래 잔액으로 DB 업데이트
            if (!result.isEmpty()) {
                account.setBalance(result.get(0).getTransactionAfterBalance());
                basicAccountRepository.save(account);
            }

            return new AccountTransactionResponseDto(result);

        } catch (Exception e) {
            throw new AccountException("거래내역 조회 실패: " + e.getMessage());
        }
    }

}
