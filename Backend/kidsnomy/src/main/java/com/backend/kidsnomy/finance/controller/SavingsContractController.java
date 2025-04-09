package com.backend.kidsnomy.finance.controller;

import com.backend.kidsnomy.finance.dto.ApiResponseDto;
import com.backend.kidsnomy.finance.dto.SavingsContractRequestDto;
import com.backend.kidsnomy.finance.service.contract.SavingsContractService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/finance/savings")
public class SavingsContractController {

    private final SavingsContractService savingsService;

    public SavingsContractController(SavingsContractService savingsService) {
        this.savingsService = savingsService;
    }

    // 적금 계좌 생성 API
    @PostMapping("/contract/{productId}")
    public ResponseEntity<ApiResponseDto> createSavingsContract(
            @PathVariable("productId") Long productId,
            @RequestBody SavingsContractRequestDto requestDto,
            HttpServletRequest request) {

        savingsService.createSavingsContract(productId, requestDto, request);

        return ResponseEntity.ok(
                new ApiResponseDto("success", "적금 상품이 성공적으로 계약되었습니다.")
        );
    }

    // 적금 계좌 조회 API
//    @GetMapping("/{accountNo}")
//    public ResponseEntity<ApiResponseDto> getSavingsAccount(
//            @PathVariable String accountNo,
//            HttpServletRequest request) {
//
//        ApiResponseDto response = savingsService.getSavingsAccount(accountNo, request);
//
//        return ResponseEntity.ok(response);
//    }
}