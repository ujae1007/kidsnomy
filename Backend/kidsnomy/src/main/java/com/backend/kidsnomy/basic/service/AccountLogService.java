package com.backend.kidsnomy.basic.service;

import com.backend.kidsnomy.basic.dto.TransactionHistoryRequestDto;
import com.backend.kidsnomy.basic.dto.TransactionHistoryResponseDto;
import com.backend.kidsnomy.basic.entity.AccountLog;
import com.backend.kidsnomy.basic.repository.AccountLogRepository;
import com.backend.kidsnomy.common.exception.AuthenticationException;
import com.backend.kidsnomy.common.service.UserKeyService;
import com.backend.kidsnomy.common.util.ApiUtils;
import com.backend.kidsnomy.jwt.JwtTokenProvider;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AccountLogService {

    private final AccountLogRepository accountLogRepository;
    private final RestTemplate restTemplate;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserKeyService userKeyService;
    private final String apiKey;
    private final String baseUrl;

    public AccountLogService(
            AccountLogRepository accountLogRepository,
            RestTemplate restTemplate,
            JwtTokenProvider jwtTokenProvider,
            UserKeyService userKeyService,
            @Value("${ssafy.api.apiKey}") String apiKey,
            @Value("${ssafy.api.base-url}") String baseUrl) {
        this.accountLogRepository = accountLogRepository;
        this.restTemplate = restTemplate;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userKeyService = userKeyService;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    /**
     * 계좌 거래 내역 조회
     */
    public TransactionHistoryResponseDto getTransactionHistory(HttpServletRequest request, TransactionHistoryRequestDto requestDto) {
        // 1. 토큰에서 이메일 추출
        String token = jwtTokenProvider.resolveAccessToken(request);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            throw new org.springframework.security.core.AuthenticationException("유효하지 않은 토큰입니다.") {};
        }
        String email = jwtTokenProvider.getEmailFromToken(token);

        // 2. 이메일로 userKey 조회
        String userKey = userKeyService.getUserKeyByEmail(email);

        // 3. API 요청 준비
        String apiUrl = baseUrl + "/ssafy/api/v1/edu/demandDeposit/inquireTransactionHistoryList";

        // GET 요청을 위한 URL 파라미터 구성
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(apiUrl)
                .queryParam("accountNo", requestDto.getAccountNo())
                .queryParam("startDate", requestDto.getStartDate())
                .queryParam("endDate", requestDto.getEndDate())
                .queryParam("transactionType", requestDto.getTransactionType())
                .queryParam("orderByType", requestDto.getOrderByType());

        // 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("apiKey", apiKey);
        headers.set("userKey", userKey);

        // API 헤더 정보 추가
        Map<String, Object> headerMap = ApiUtils.createApiRequestHeader("inquireTransactionHistoryList", apiKey, userKey);
        for (Map.Entry<String, Object> entry : headerMap.entrySet()) {
            headers.set(entry.getKey(), entry.getValue().toString());
        }

        try {
            // GET 요청 보내기
            HttpEntity<String> httpEntity = new HttpEntity<>(headers);
            ResponseEntity<Map> responseEntity = restTemplate.exchange(
                    builder.toUriString(),
                    HttpMethod.GET,
                    httpEntity,
                    Map.class);

            Map<String, Object> response = responseEntity.getBody();

            if (response == null || !(response.get("REC") instanceof Map)) {
                throw new RuntimeException("거래 내역 조회 응답에 필요한 정보가 없습니다.");
            }

            Map<String, Object> rec = (Map<String, Object>) response.get("REC");
            List<Map<String, Object>> transactionList = (List<Map<String, Object>>) rec.get("list");

            List<TransactionHistoryResponseDto.TransactionDto> transactions = new ArrayList<>();
            if (transactionList != null) {
                transactions = transactionList.stream()
                        .map(transaction -> {
                            BigDecimal transactionBalance = new BigDecimal(
                                    Optional.ofNullable(transaction.get("transactionBalance"))
                                            .orElse("0").toString());

                            BigDecimal transactionAfterBalance = new BigDecimal(
                                    Optional.ofNullable(transaction.get("transactionAfterBalance"))
                                            .orElse("0").toString());

                            return TransactionHistoryResponseDto.TransactionDto.builder()
                                    .transactionUniqueNo((String) transaction.get("transactionUniqueNo"))
                                    .transactionDate((String) transaction.get("transactionDate"))
                                    .transactionTime((String) transaction.get("transactionTime"))
                                    .transactionType((String) transaction.get("transactionType"))
                                    .transactionTypeName((String) transaction.get("transactionTypeName"))
                                    .transactionAccountNo((String) transaction.get("transactionAccountNo"))
                                    .transactionBalance(transactionBalance)
                                    .transactionAfterBalance(transactionAfterBalance)
                                    .transactionSummary((String) transaction.get("transactionSummary"))
                                    .transactionMemo((String) transaction.get("transactionMemo"))
                                    .build();
                        })
                        .collect(Collectors.toList());
            }

            return TransactionHistoryResponseDto.builder()
                    .totalCount(rec.get("totalCount") != null ? (String) rec.get("totalCount") : "0")
                    .list(transactions)
                    .build();

        } catch (HttpClientErrorException e) {
            throw new RuntimeException("SSAFY API 호출 실패: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            throw new RuntimeException("거래 내역 조회 중 오류 발생: " + e.getMessage());
        }
    }

    /**
     * 거래 내역 저장
     */
    @Transactional
    public void saveTransactionLog(AccountLog accountLog) {
        accountLogRepository.save(accountLog);
    }
}

