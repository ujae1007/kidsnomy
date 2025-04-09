package com.backend.kidsnomy.finance.service;

import com.backend.kidsnomy.finance.dto.FinanceProductResponseDto;
import com.backend.kidsnomy.finance.dto.SavingsDetailDto;
import com.backend.kidsnomy.finance.dto.DepositDetailDto;
import com.backend.kidsnomy.finance.dto.FinanceContractResponseDto;
import com.backend.kidsnomy.finance.entity.*;
import com.backend.kidsnomy.finance.repository.*;
import com.backend.kidsnomy.group.repository.GroupMembershipRepository;
import com.backend.kidsnomy.jwt.JwtTokenProvider;
import com.backend.kidsnomy.user.entity.User;
import com.backend.kidsnomy.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FinanceQueryService {

    private final DepositRepository depositRepository;
    private final SavingsRepository savingsRepository;
    private final DepositContractRepository depositContractRepository;
    private final SavingsContractRepository savingsContractRepository;
    private final GroupMembershipRepository groupMembershipRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    public FinanceQueryService(DepositRepository depositRepository,
                               SavingsRepository savingsRepository,
                               DepositContractRepository depositContractRepository,
                               SavingsContractRepository savingsContractRepository,
                               GroupMembershipRepository groupMembershipRepository,
                               JwtTokenProvider jwtTokenProvider,
                               UserRepository userRepository) {
        this.depositRepository = depositRepository;
        this.savingsRepository = savingsRepository;
        this.depositContractRepository = depositContractRepository;
        this.savingsContractRepository = savingsContractRepository;
        this.groupMembershipRepository = groupMembershipRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    // 자녀 - 그룹 내 멘토(어른)가 만든 모든 금융 상품 조회
    public List<FinanceProductResponseDto> getMentorFinanceProducts(Long groupId, HttpServletRequest request) {
        // ✅ JWT 토큰에서 email 추출
        String token = jwtTokenProvider.resolveAccessToken(request);
        String email = jwtTokenProvider.getEmailFromToken(token);
        User child = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자 정보를 찾을 수 없습니다."));
        Long childId = child.getId();

        // 어른이 만든 예금 상품
        List<Deposit> deposits = depositRepository.findByGroupId(groupId);
        List<FinanceProductResponseDto> depositDtos = deposits.stream()
            .map(deposit -> {
                boolean contracted = depositContractRepository.existsByDepositIdAndUserId(deposit.getId(), childId);
                int status = contracted ? 1 : 0;
                return new FinanceProductResponseDto(
                    deposit.getId(),
                    deposit.getGroupId(),
                    deposit.getUserId(),
                    deposit.getTitle(),
                    deposit.getContent(),
                    deposit.getInterestRate(),
                    deposit.getDueDate(),
                    null, null, deposit.getProductType(),
                    status
                );
            }).collect(Collectors.toList());

        // 어른이 만든 적금 상품
        List<Savings> savingsList = savingsRepository.findByGroupId(groupId);
        List<FinanceProductResponseDto> savingsDtos = savingsList.stream()
            .map(savings -> {
                boolean contracted = savingsContractRepository.existsBySavingsIdAndUserId(savings.getId(), childId);
                int status = contracted ? 1 : 0;
                return new FinanceProductResponseDto(
                    savings.getId(),
                    savings.getGroupId(),
                    savings.getUserId(),
                    savings.getTitle(),
                    savings.getContent(),
                    savings.getInterestRate(),
                    savings.getDueDate(),
                    savings.getRateDate(),
                    savings.getPayDate(),
                    savings.getProductType(),
                    status
                );
            }).collect(Collectors.toList());

        // 통합 결과
        List<FinanceProductResponseDto> result = new ArrayList<>();
        result.addAll(depositDtos);
        result.addAll(savingsDtos);
        return result;
    }

    // 자녀 - 본인이 계약한 금융 상품 조회
    public List<FinanceContractResponseDto> getMyFinanceContracts(HttpServletRequest request) {
        User child = extractUserFromToken(request);
        validateChild(child);

        Long userId = child.getId();

        List<DepositContract> deposits = depositContractRepository.findByUserId(userId);
        List<SavingsContract> savings = savingsContractRepository.findByUserId(userId);

        List<FinanceContractResponseDto> depositDtoList = deposits.stream()
                .map(c -> new FinanceContractResponseDto(
                        c.getId(), c.getGroupId(), c.getUserId(), c.getDeposit().getId(), c.getAccountNo(),
                        c.getStartDay(), c.getEndDay(), c.getBalance(),
                        c.getTotalVolume(), null, null, c.getStatus(), (byte) 0, c.getDeposit().getTitle()
                ))
                .collect(Collectors.toList());

        List<FinanceContractResponseDto> savingsDtoList = savings.stream()
                .map(c -> new FinanceContractResponseDto(
                        c.getId(), c.getGroupId(), c.getUserId(), c.getSavings().getId(), c.getAccountNo(),
                        c.getStartDay(), c.getEndDay(), c.getBalance(),
                        null, c.getOneTimeVolume(), c.getRateVolume(), c.getStatus(), (byte) 1, c.getSavings().getTitle()
                ))
                .collect(Collectors.toList());

        depositDtoList.addAll(savingsDtoList);
        return depositDtoList;
    }

    // 부모 - 본인이 만든 금융 상품 조회
    public List<FinanceProductResponseDto> getMyCreatedProducts(Long groupId, HttpServletRequest request) {
        User parent = extractUserFromToken(request);
        validateParent(parent);

        if (!groupMembershipRepository.existsByUserIdAndGroupId(parent.getId(), groupId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인이 속한 그룹이 아닙니다.");
        }

        List<Deposit> deposits = depositRepository.findByGroupId(groupId).stream()
                .filter(d -> d.getUserId().equals(parent.getId()))
                .collect(Collectors.toList());

        List<Savings> savings = savingsRepository.findByGroupId(groupId).stream()
                .filter(s -> s.getUserId().equals(parent.getId()))
                .collect(Collectors.toList());

        List<FinanceProductResponseDto> depositDtoList = deposits.stream()
                .map(d -> new FinanceProductResponseDto(
                        d.getId(), d.getGroupId(), d.getUserId(), d.getTitle(), d.getContent(),
                        d.getInterestRate(), d.getDueDate(), null, null, (byte) 0, 0
                ))
                .collect(Collectors.toList());

        List<FinanceProductResponseDto> savingsDtoList = savings.stream()
                .map(s -> new FinanceProductResponseDto(
                        s.getId(), s.getGroupId(), s.getUserId(), s.getTitle(), s.getContent(),
                        s.getInterestRate(), s.getDueDate(), s.getRateDate(), s.getPayDate(), (byte) 1, 0
                ))
                .collect(Collectors.toList());

        depositDtoList.addAll(savingsDtoList);
        return depositDtoList;
    }

    // 토큰 검증
    private User extractUserFromToken(HttpServletRequest request) {
        String token = jwtTokenProvider.resolveAccessToken(request);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다.");
        }

        String email = jwtTokenProvider.getEmailFromToken(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));
    }

    private void validateParent(User user) {
        if (user.getIsParent() == null || !user.getIsParent()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "부모 사용자만 접근할 수 있습니다.");
        }
    }

    private void validateChild(User user) {
        if (user.getIsParent() != null && user.getIsParent()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "자녀 사용자만 접근할 수 있습니다.");
        }
    }
    
    // 예금 상품 상세 조회
    public DepositDetailDto getDepositDetail(Long productId) {
        Deposit deposit = depositRepository.findById(productId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "예금 상품을 찾을 수 없습니다."));

        return new DepositDetailDto(
            deposit.getId(),
            deposit.getGroupId(),
            deposit.getUserId(),
            deposit.getTitle(),
            deposit.getContent(),
            deposit.getInterestRate(),
            deposit.getDueDate(),
            deposit.getProductType().intValue()
        );
    }

    // 적금 상품 상세 조회
    public SavingsDetailDto getSavingsDetail(Long productId) {
        Savings savings = savingsRepository.findById(productId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "적금 상품을 찾을 수 없습니다."));

        return new SavingsDetailDto(
            savings.getId(),
            savings.getGroupId(),
            savings.getUserId(),
            savings.getTitle(),
            savings.getContent(),
            savings.getInterestRate(),
            savings.getDueDate(),
            savings.getRateDate(),
            savings.getPayDate(),
            savings.getProductType()
        );
    }

}
