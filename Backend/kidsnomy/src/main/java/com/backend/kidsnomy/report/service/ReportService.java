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
import com.backend.kidsnomy.user.entity.User;
import com.backend.kidsnomy.user.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
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
    
    // 리포트 생성
    public Map<String, Object> sendWeeklyTransactionReport(HttpServletRequest request) {
        String token = jwtTokenProvider.resolveAccessToken(request);
        String email = jwtTokenProvider.getEmailFromToken(token);

        var user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Long userId = user.getId();
        List<BasicAccount> accounts = basicAccountRepository.findByUserId(userId);
        if (accounts.isEmpty()) throw new RuntimeException("사용자 계좌가 없습니다.");

        String accountNo = accounts.get(0).getAccountNo();

        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusWeeks(4);
        LocalDate endDate = today;

        basicAccountService.getAccountLog(
            request,
            new AccountTransactionRequestDto(
                accountNo,
                startDate.format(DateTimeFormatter.ofPattern("yyyyMMdd")),
                endDate.format(DateTimeFormatter.ofPattern("yyyyMMdd")),
                "A", "DESC"
            )
        );

//        List<AccountLog> logs = accountLogRepository.findAllByAccountNo(accountNo);
//        Map<String, List<TransactionSummaryDto>> weeklyMap = new LinkedHashMap<>();
//        LocalDate monday = today.with(DayOfWeek.MONDAY);
//
//        for (int i = 4; i >= 0; i--) {
//            LocalDate weekStart = monday.minusWeeks(i);
//            LocalDate weekEnd = weekStart.plusDays(6);
//            String key = "week" + (5 - i);
//            List<TransactionSummaryDto> weeklyList = new ArrayList<>();
//
//            for (AccountLog log : logs) {
//                LocalDate txDate = LocalDate.parse(log.getTransactionDate(), DateTimeFormatter.ofPattern("yyyyMMdd"));
//                if (!txDate.isBefore(weekStart) && !txDate.isAfter(weekEnd)) {
//                    TransactionSummaryDto dto = new TransactionSummaryDto();
//                    dto.setTransactionDate(log.getTransactionDate());
//                    dto.setTransactionType(log.getTransactionType());
//                    dto.setTransactionBalance(log.getTransactionBalance());
//                    dto.setTransactionSummary(log.getTransactionSummary());
//                    weeklyList.add(dto);
//                }
//            }
//
//            weeklyMap.put(key, weeklyList);
//        }
        
        Map<String, List<TransactionSummaryDto>> weeklyMap = new LinkedHashMap<>();

        weeklyMap.put("week1", List.of(
            new TransactionSummaryDto("20250330", 1, new BigDecimal("250000.00"), "왕가탕후루 충장로점, 광주 동구 충장로3가 41-1"),
            new TransactionSummaryDto("20250330", 1, new BigDecimal("250000.00"), "더벙커게임존, 대전 유성구 대학로 34")
        ));

        weeklyMap.put("week2", List.of(
            new TransactionSummaryDto("20250330", 1, new BigDecimal("250000.00"), "설빙 유성온천점, 대전 유성구 대학로 14"),
            new TransactionSummaryDto("20250330", 1, new BigDecimal("250000.00"), "왕가탕후루 충장로점, 광주 동구 충장로3가 41-1")
        ));

        weeklyMap.put("week3", List.of(
            new TransactionSummaryDto("20250330", 1, new BigDecimal("250000.00"), "왕가탕후루 충장로점, 광주 동구 충장로3가 41-1")
        ));

        weeklyMap.put("week4", List.of(
            new TransactionSummaryDto("20250330", 1, new BigDecimal("250000.00"), "왕가탕후루 충장로점, 광주 동구 충장로3가 41-1")
        ));

        weeklyMap.put("week5", List.of(
            new TransactionSummaryDto("20250330", 1, new BigDecimal("250000.00"), "더벙커게임존, 대전 유성구 대학로 34")
        ));

        ReportRequestDto reportDto = new ReportRequestDto(accountNo, weeklyMap);

        // ✅ FastAPI 전송 전 JSON 출력
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String json = objectMapper.writeValueAsString(reportDto);
            System.out.println("\n📦 FastAPI 전송 JSON 확인 ===============================");
            System.out.println(json);
            System.out.println("=======================================================\n");
        } catch (JsonProcessingException e) {
            System.out.println("⚠️ JSON 직렬화 오류: " + e.getMessage());
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<ReportRequestDto> requestEntity = new HttpEntity<>(reportDto, headers);

        Map<String, Object> fastApiResponse;
        try {
            fastApiResponse = restTemplate.postForObject(reportUrl, requestEntity, Map.class);
        } catch (Exception e) {
            // 개발용 mock 응답
            Map<String, Object> weekExpense = Map.of(
                "week1", 0, "week2", 0, "week3", 0, "week4", 0, "week5", 0
            );
            Map<String, Object> response = new HashMap<>();
            response.put("weekExpense", weekExpense);
            response.put("totalExpense", 0);

            fastApiResponse = new HashMap<>();
            fastApiResponse.put("response", response);
        }

        // 평균 출금/입금 비율 계산
        BigDecimal avgRate = calculateAverageWithdrawalRate(user.getAge(), user.getGender());

        // 결과에 추가
        fastApiResponse.put("averageWithdrawalRate", avgRate);

        return fastApiResponse;
    }

    
    // 동 성별, 동 나이대 애들 입,출금 평균
    private BigDecimal calculateAverageWithdrawalRate(int age, String gender) {
        List<User> users = userRepository.findAllByAgeAndGenderAndIsParent(age, gender, false);

        BigDecimal totalRatio = BigDecimal.ZERO;
        int count = 0;

        for (User user : users) {
            List<BasicAccount> accounts = basicAccountRepository.findByUserId(user.getId());
            BigDecimal withdrawSum = BigDecimal.ZERO;
            BigDecimal depositSum = BigDecimal.ZERO;

            for (BasicAccount acc : accounts) {
                List<AccountLog> logs = accountLogRepository.findAllByAccountNo(acc.getAccountNo());
                for (AccountLog log : logs) {
                    if (log.getTransactionType() == 1) {
                        withdrawSum = withdrawSum.add(log.getTransactionBalance());
                    } else if (log.getTransactionType() == 0) {
                        depositSum = depositSum.add(log.getTransactionBalance());
                    }
                }
            }

            if (depositSum.compareTo(BigDecimal.ZERO) > 0) {
                totalRatio = totalRatio.add(withdrawSum.divide(depositSum, 4, RoundingMode.HALF_UP));
                count++;
            }
        }

        return count > 0 ? totalRatio.divide(BigDecimal.valueOf(count), 4, RoundingMode.HALF_UP) : BigDecimal.ZERO;
    }
}