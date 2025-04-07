package com.backend.kidsnomy.finance.controller;

import com.backend.kidsnomy.finance.dto.ApiResponseDto;
import com.backend.kidsnomy.finance.entity.DepositContract;
import com.backend.kidsnomy.finance.repository.DepositContractRepository;
import com.backend.kidsnomy.finance.service.deposithandler.DepositInitialHandler;
import com.backend.kidsnomy.finance.service.deposithandler.DepositMaturityHandler;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auto/transfer/deposit")
public class DepositTransferController {
    private final DepositInitialHandler depositInitialHandler;
    private final DepositMaturityHandler depositMaturityHandler;
    private final DepositContractRepository depositContractRepo;

    public DepositTransferController(
            DepositInitialHandler depositInitialHandler,
            DepositMaturityHandler depositMaturityHandler,
            DepositContractRepository depositContractRepo
    ) {
        this.depositInitialHandler = depositInitialHandler;
        this.depositMaturityHandler = depositMaturityHandler;
        this.depositContractRepo = depositContractRepo;
    }

    // 1-1. 예금 계약 직후 목돈 입금
    @PostMapping("/initial/{contractId}")
    public ResponseEntity<ApiResponseDto> transferInitialDeposit(
            @PathVariable Long contractId
    ) {
        depositInitialHandler.processSingle(contractId);
        return ResponseEntity.ok(new ApiResponseDto("success", "목돈이 성공적으로 입금되었습니다."));
    }

    // 1-2. 예금 만기 이체
    @PostMapping("/maturity/{contractId}")
    public ResponseEntity<ApiResponseDto> transferDepositMaturity(
            @PathVariable Long contractId
    ) {
        DepositContract contract = depositContractRepo.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("예금 계약을 찾을 수 없습니다."));

        depositMaturityHandler.processSingleMaturity(contract);
        return ResponseEntity.ok(new ApiResponseDto("success", "만기 처리 완료: 원금+이자가 아이 계좌로 이체되었습니다."));
    }
}
