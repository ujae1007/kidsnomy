package com.backend.kidsnomy.finance.controller;

import com.backend.kidsnomy.finance.dto.ApiResponseDto;
import com.backend.kidsnomy.finance.entity.SavingsContract;
import com.backend.kidsnomy.finance.repository.SavingsContractRepository;
import com.backend.kidsnomy.finance.service.savingshandler.SavingsMaturityHandler;
import com.backend.kidsnomy.finance.service.savingshandler.SavingsRegularHandler;
import com.backend.kidsnomy.finance.service.savingshandler.SavingsInterestHandler;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auto/transfer/savings")
public class SavingsTransferController {

    private final SavingsContractRepository savingsContractRepository;
    private final SavingsRegularHandler savingsRegularHandler;
    private final SavingsInterestHandler savingsInterestHandler;
    private final SavingsMaturityHandler savingsMaturityHandler;

    public SavingsTransferController(
            SavingsContractRepository savingsContractRepository,
            SavingsRegularHandler savingsRegularHandler,
            SavingsInterestHandler savingsInterestHandler,
            SavingsMaturityHandler savingsMaturityHandler) {
        this.savingsContractRepository = savingsContractRepository;
        this.savingsRegularHandler = savingsRegularHandler;
        this.savingsInterestHandler = savingsInterestHandler;
        this.savingsMaturityHandler = savingsMaturityHandler;
    }

    // 2-1. 적금 정기 납입
    @PostMapping("/regular/{savingContractId}")
    public ResponseEntity<?> processRegularSavings(
            @PathVariable Long contractId,
            HttpServletRequest request
    ) {
        savingsRegularHandler.processRegularSavings(contractId, request); //
        return ResponseEntity.ok().body("정기 납입이 완료되었습니다.");
    }

    // 2-2. 적금 이자 지급
    @PostMapping("/interest/{contractId}")
    public ResponseEntity<ApiResponseDto> transferSavingsInterest(
            @PathVariable Long contractId
    ) {
        SavingsContract contract = savingsContractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("적금 계약을 찾을 수 없습니다."));

        savingsInterestHandler.processSingle(contract); // 단일 처리 메서드 호출
        return ResponseEntity.ok(new ApiResponseDto("success", "적금 이자 지급 완료"));
    }

    // 2-3. 적금 만기 이체
    @PostMapping("/maturity/{contractId}")
    public ResponseEntity<ApiResponseDto> processMaturity(
            @PathVariable Long contractId
    ) {
        SavingsContract contract = savingsContractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("적금 계약을 찾을 수 없습니다."));

        savingsMaturityHandler.processSingleMaturity(contract);
        return ResponseEntity.ok(new ApiResponseDto("success", "만기 처리 완료"));
    }
}
