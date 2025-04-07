package com.backend.kidsnomy.basic.controller;

import com.backend.kidsnomy.basic.dto.*;
import com.backend.kidsnomy.basic.service.BasicAccountService;
import com.backend.kidsnomy.common.exception.AuthenticationException;
import com.backend.kidsnomy.jwt.JwtTokenProvider;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
public class BasicAccountController {

    private final BasicAccountService basicAccountService;
    private final JwtTokenProvider jwtTokenProvider;

    // 수동 생성자
    public BasicAccountController(BasicAccountService basicAccountService, JwtTokenProvider jwtTokenProvider) {
        this.basicAccountService = basicAccountService;
        this.jwtTokenProvider = jwtTokenProvider; 
    }

    // 계좌 생성 API
    @PostMapping("/create")
    public ResponseEntity<BasicAccountResponseDto> createAccount(
            HttpServletRequest request,
            @Valid @RequestBody BasicAccountRequestDto requestDto) {
        System.out.println("✅ 계좌 생성 요청 도착: " + request.getRequestURI());
        BasicAccountResponseDto responseDto = basicAccountService.createAccount(request, requestDto);
        return ResponseEntity.ok(responseDto);
    }

    // 계좌 조회 API
    @PostMapping("/check")
    public ResponseEntity<AccountCheckResponseDto> retrieveAccount(
            HttpServletRequest request,
            @Valid @RequestBody AccountCheckRequestDto requestDto) {
        System.out.println("✅ 계좌 조회 요청 도착: " + request.getRequestURI());
        AccountCheckResponseDto responseDto = basicAccountService.retrieveAccount(request, requestDto);
        return ResponseEntity.ok(responseDto);
    }

    // 계좌 해지 API
    @DeleteMapping("/delete")
    public ResponseEntity<AccountCloseResponseDto> deleteAccount(
            HttpServletRequest request,
            @Valid @RequestBody AccountCloseRequestDto requestDto) {
        System.out.println("✅ 계좌 해지 요청 도착: " + request.getRequestURI());
        AccountCloseResponseDto responseDto = basicAccountService.deleteAccount(request, requestDto);
        return ResponseEntity.ok(responseDto);
    }
    

    // 계좌 거래 내역 조회 API
    @GetMapping("/accountlog")
    public ResponseEntity<AccountTransactionResponseDto> getAccountLog(
            HttpServletRequest request,
            @Valid @RequestBody AccountTransactionRequestDto requestDto) {
        AccountTransactionResponseDto response = basicAccountService.getAccountLog(request, requestDto);
        return ResponseEntity.ok(response);
    }

    // 계좌 셍세 조회 API
    @GetMapping("/detail")
    public ResponseEntity<AccountDetailResponseDto> getMyAccountDetail(HttpServletRequest request) {
        String token = jwtTokenProvider.resolveAccessToken(request);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            throw new AuthenticationException("유효하지 않은 토큰입니다.");
        }

        String email = jwtTokenProvider.getEmailFromToken(token);
        AccountDetailResponseDto response = basicAccountService.getMyAccountDetail(email);
        return ResponseEntity.ok(response);
    }

}
