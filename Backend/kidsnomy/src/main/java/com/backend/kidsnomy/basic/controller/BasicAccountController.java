package com.backend.kidsnomy.basic.controller;

import com.backend.kidsnomy.basic.dto.*;
import com.backend.kidsnomy.basic.service.BasicAccountService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
public class BasicAccountController {

    private final BasicAccountService basicAccountService;

    // 수동 생성자
    public BasicAccountController(BasicAccountService basicAccountService) {
        this.basicAccountService = basicAccountService;
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
    @GetMapping("/check")
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
}
