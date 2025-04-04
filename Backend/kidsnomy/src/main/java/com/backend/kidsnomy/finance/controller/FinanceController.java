package com.backend.kidsnomy.finance.controller;

import com.backend.kidsnomy.finance.dto.DepositCreateRequestDto;
import com.backend.kidsnomy.finance.dto.SavingsCreateRequestDto;
import com.backend.kidsnomy.finance.service.DepositService;
import com.backend.kidsnomy.finance.service.SavingsService;
import com.backend.kidsnomy.jwt.JwtTokenProvider;
import com.backend.kidsnomy.user.entity.User;
import com.backend.kidsnomy.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/finance")
public class FinanceController {

    private final DepositService depositService;
    private final SavingsService savingsService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    public FinanceController(DepositService depositService,
                             SavingsService savingsService,
                             JwtTokenProvider jwtTokenProvider,
                             UserRepository userRepository) {
        this.depositService = depositService;
        this.savingsService = savingsService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

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
}
