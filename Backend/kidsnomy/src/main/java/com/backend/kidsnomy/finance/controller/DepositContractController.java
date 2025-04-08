package com.backend.kidsnomy.finance.controller;

import com.backend.kidsnomy.finance.dto.ApiResponseDto;
import com.backend.kidsnomy.finance.dto.DepositContractRequestDto;
import com.backend.kidsnomy.finance.service.contract.DepositContractService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/finance/deposit")
public class DepositContractController {

    private final DepositContractService depositService;

    public DepositContractController(DepositContractService depositService) {
        this.depositService = depositService;
    }

    // 예금 계좌 생성 API
    @PostMapping("/contract/{productId}")
    public ResponseEntity<ApiResponseDto> createDepositContract(
            @PathVariable("productId") Long productId,
            @RequestBody DepositContractRequestDto requestDto,
            HttpServletRequest request) {

        depositService.createDepositContract(productId, requestDto, request);

        return ResponseEntity.ok(
                new ApiResponseDto("success", "예금 상품이 성공적으로 계약되었습니다.")
        );
    }

    // 예금 계좌 조회 API
//    @GetMapping("/{accountNo}")
//    public ResponseEntity<ApiResponseDto> getDepositAccount(
//            @PathVariable String accountNo,
//            HttpServletRequest request) {
//
//        ApiResponseDto response = depositService.getDepositAccount(accountNo, request);
//
//        return ResponseEntity.ok(response);
//    }
}