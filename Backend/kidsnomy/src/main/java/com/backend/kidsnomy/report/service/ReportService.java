package com.backend.kidsnomy.report.service;

import com.backend.kidsnomy.basic.dto.AccountTransactionRequestDto;
import com.backend.kidsnomy.basic.entity.AccountLog;
import com.backend.kidsnomy.basic.entity.BasicAccount;
import com.backend.kidsnomy.basic.repository.AccountLogRepository;
import com.backend.kidsnomy.basic.repository.BasicAccountRepository;
import com.backend.kidsnomy.basic.service.BasicAccountService;
import com.backend.kidsnomy.jwt.JwtTokenProvider;
import com.backend.kidsnomy.report.dto.ReportRequestDto;
import com.backend.kidsnomy.report.dto.TransactionSummaryDto;
import com.backend.kidsnomy.user.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ReportService {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final BasicAccountRepository basicAccountRepository;
    private final AccountLogRepository accountLogRepository;
    private final BasicAccountService basicAccountService;
    private final RestTemplate restTemplate;

    @Value("${fastapi.report.url}")
    private String reportUrl;

    public ReportService(JwtTokenProvider jwtTokenProvider,
                         UserRepository userRepository,
                         BasicAccountRepository basicAccountRepository,
                         AccountLogRepository accountLogRepository,
                         BasicAccountService basicAccountService,
                         RestTemplate restTemplate) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.basicAccountRepository = basicAccountRepository;
        this.accountLogRepository = accountLogRepository;
        this.basicAccountService = basicAccountService;
        this.restTemplate = restTemplate;
    }

    public void sendWeeklyTransactionReport(HttpServletRequest request) {
        // 1. 사용자 이메일 및 계좌 번호 조회
        String token = jwtTokenProvider.resolveAccessToken(request);
        String email = jwtTokenProvider.getEmailFromToken(token);
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."))
                .getId();
        List<BasicAccount> accounts = basicAccountRepository.findByUserId(userId);
        if (accounts.isEmpty()) {
            throw new RuntimeException("사용자 계좌가 없습니다.");
        }
        String accountNo = accounts.get(0).getAccountNo();

     // ✅ 2. 외부 API 호출 (기존 코드 대신 아래 코드 사용)
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusWeeks(4); // 5주치 시작일
        LocalDate endDate = today;

        basicAccountService.getAccountLog(
            request,
            new AccountTransactionRequestDto(
                accountNo,
                startDate.format(DateTimeFormatter.ofPattern("yyyyMMdd")),
                endDate.format(DateTimeFormatter.ofPattern("yyyyMMdd")),
                "A",        // 전체 거래내역
                "DESC"      // 최신순
            )
        );

        // 3. 저장된 데이터 기반 주차별 리포트 생성
        List<AccountLog> logs = accountLogRepository.findAllByAccountNo(accountNo);
        Map<String, List<TransactionSummaryDto>> weeklyMap = new LinkedHashMap<>();
        LocalDate monday = today.with(DayOfWeek.MONDAY);

        for (int i = 4; i >= 0; i--) {
            LocalDate weekStart = monday.minusWeeks(i);
            LocalDate weekEnd = weekStart.plusDays(6);
            String key = "week" + (5 - i);
            List<TransactionSummaryDto> weeklyList = new ArrayList<>();

            for (AccountLog log : logs) {
                // 1. 문자열을 날짜로 변환 (비교용)
                LocalDate txDate = LocalDate.parse(log.getTransactionDate(), DateTimeFormatter.ofPattern("yyyyMMdd"));

                if (!txDate.isBefore(weekStart) && !txDate.isAfter(weekEnd)) {
                    TransactionSummaryDto dto = new TransactionSummaryDto();
                    dto.setTransactionDate(log.getTransactionDate());  // 그대로 "20250403"
                    dto.setTransactionType(log.getTransactionType());
                    dto.setTransactionBalance(log.getTransactionBalance());
                    dto.setTransactionSummary(log.getTransactionSummary());
                    weeklyList.add(dto);
                }
            }

            weeklyMap.put(key, weeklyList);
        }

        // 4. FastAPI에 전송
        ReportRequestDto reportDto = new ReportRequestDto(accountNo, weeklyMap);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String json = objectMapper.writeValueAsString(reportDto);
            System.out.println("\n📦 FastAPI 전송 내용 확인:");
            System.out.println(json);
        } catch (JsonProcessingException e) {
            System.out.println("⚠️ JSON 변환 오류: " + e.getMessage());
        }

//        HttpEntity<ReportRequestDto> requestEntity = new HttpEntity<>(reportDto, headers);
//        restTemplate.postForObject(reportUrl, requestEntity, Void.class);
    }
}
