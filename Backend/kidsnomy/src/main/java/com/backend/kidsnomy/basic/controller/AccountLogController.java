package com.backend.kidsnomy.basic.controller;

import com.backend.kidsnomy.basic.dto.TransactionHistoryRequestDto;
import com.backend.kidsnomy.basic.dto.TransactionHistoryResponseDto;
import com.backend.kidsnomy.basic.service.AccountLogService;
import com.backend.kidsnomy.common.exception.AuthenticationException;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/account")
public class AccountLogController {

    private final AccountLogService accountLogService;

    @Autowired
    public AccountLogController(AccountLogService accountLogService) {
        this.accountLogService = accountLogService;
    }

    @GetMapping("/accountlog")
    public ResponseEntity<?> getTransactionHistory(
            HttpServletRequest request,
            @RequestParam(value = "accountNo", required = false) @NotBlank String accountNo,
            @RequestParam("startDate") @NotBlank @Pattern(regexp = "^\\d{8}$") String startDate,
            @RequestParam("endDate") @NotBlank @Pattern(regexp = "^\\d{8}$") String endDate,
            @RequestParam("transactionType") @NotBlank @Pattern(regexp = "^[MDA]$") String transactionType,
            @RequestParam(value = "orderByType", defaultValue = "DESC") String orderByType) {

        System.out.println("✅ 거래 내역 조회 요청 도착: " + request.getRequestURI());
        System.out.println("📌 accountNo: " + accountNo);  // 추가

        try {
            // RequestParam으로 받은 값들을 DTO로 변환
            TransactionHistoryRequestDto requestDto = TransactionHistoryRequestDto.builder()
                    .accountNo(accountNo)
                    .startDate(startDate)
                    .endDate(endDate)
                    .transactionType(transactionType)
                    .orderByType(orderByType)
                    .build();

            TransactionHistoryResponseDto responseDto = accountLogService.getTransactionHistory(request, requestDto);
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
        }
    }
}