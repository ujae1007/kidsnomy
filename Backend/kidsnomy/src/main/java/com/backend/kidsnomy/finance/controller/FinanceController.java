package com.backend.kidsnomy.finance.controller;

import com.backend.kidsnomy.finance.dto.*;
import com.backend.kidsnomy.finance.service.DepositService;
import com.backend.kidsnomy.finance.service.SavingsService;
import com.backend.kidsnomy.finance.service.FinanceQueryService;
import com.backend.kidsnomy.jwt.JwtTokenProvider;
import com.backend.kidsnomy.user.entity.User;
import com.backend.kidsnomy.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/finance")
public class FinanceController {

    private final DepositService depositService;
    private final SavingsService savingsService;
    private final FinanceQueryService financeQueryService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    public FinanceController(DepositService depositService,
                             SavingsService savingsService,
                             FinanceQueryService financeQueryService,
                             JwtTokenProvider jwtTokenProvider,
                             UserRepository userRepository) {
        this.depositService = depositService;
        this.savingsService = savingsService;
        this.financeQueryService = financeQueryService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    // 예금 등록
    @PostMapping("/deposit/create")
    public ResponseEntity<String> createDeposit(@RequestBody DepositCreateRequestDto requestDto,
                                                HttpServletRequest request) {
        String token = jwtTokenProvider.resolveAccessToken(request);
        String email = jwtTokenProvider.getEmailFromToken(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "유효하지 않은 사용자입니다."));

        if (!Boolean.TRUE.equals(user.getIsParent())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "부모 사용자만 예금 상품을 등록할 수 있습니다.");
        }

        depositService.createDeposit(user.getId(), requestDto);
        return ResponseEntity.ok("예금 상품이 등록되었습니다.");
    }

    // 적금 등록
    @PostMapping("/savings/create")
    public ResponseEntity<String> createSavings(@RequestBody SavingsCreateRequestDto requestDto,
                                                HttpServletRequest request) {
        String token = jwtTokenProvider.resolveAccessToken(request);
        String email = jwtTokenProvider.getEmailFromToken(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "유효하지 않은 사용자입니다."));

        if (!Boolean.TRUE.equals(user.getIsParent())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "부모 사용자만 적금 상품을 등록할 수 있습니다.");
        }

        savingsService.createSavings(user.getId(), requestDto);
        return ResponseEntity.ok("적금 상품이 등록되었습니다.");
    }

    // (자녀) 그룹 내 어른이 만든 금융 상품 조회
    @GetMapping("/child/check/{groupId}")
    public ResponseEntity<ApiResponseDto> getMentorFinanceProducts(
            @PathVariable("groupId") Long groupId,
            HttpServletRequest request) {
        List<FinanceProductResponseDto> result = financeQueryService.getMentorFinanceProducts(groupId, request);
        return ResponseEntity.ok(new ApiResponseDto("success", "그룹 내 금융 상품 조회 성공", result));
    }

    // (자녀) 본인이 계약한 금융 상품 조회
    @GetMapping("/child/contracted")
    public ResponseEntity<ApiResponseDto> getMyFinanceContracts(HttpServletRequest request) {
        List<FinanceContractResponseDto> result = financeQueryService.getMyFinanceContracts(request);
        return ResponseEntity.ok(new ApiResponseDto("success", "계약한 금융 상품 조회 성공", result));
    }

    // (부모) 본인이 만든 금융 상품 조회
    @GetMapping("/parent/check/{groupId}")
    public ResponseEntity<ApiResponseDto> getMyCreatedFinanceProducts(
            @PathVariable("groupId") Long groupId,
            HttpServletRequest request) {
        List<FinanceProductResponseDto> result = financeQueryService.getMyCreatedProducts(groupId, request);
        return ResponseEntity.ok(new ApiResponseDto("success", "부모가 만든 금융 상품 조회 성공", result));
    }
    
    // 예금 상품 상세 조회
    @GetMapping("/deposit/{productId}")
    public ResponseEntity<DepositDetailDto> getDepositDetail(@PathVariable("productId") Long productId) {
        DepositDetailDto detail = financeQueryService.getDepositDetail(productId);
        return ResponseEntity.ok(detail);
    }
    
    // 적금 상품 상세 조회
    @GetMapping("/savings/{productId}")
    public ResponseEntity<SavingsDetailDto> getSavingsDetail(@PathVariable("productId") Long productId) {
        SavingsDetailDto detail = financeQueryService.getSavingsDetail(productId);
        return ResponseEntity.ok(detail);
    }
}
