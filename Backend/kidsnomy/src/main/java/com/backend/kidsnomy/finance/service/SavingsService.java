package com.backend.kidsnomy.finance.service;

import com.backend.kidsnomy.finance.dto.SavingsCreateRequestDto;
import com.backend.kidsnomy.finance.entity.Savings;
import com.backend.kidsnomy.finance.repository.SavingsRepository;
import com.backend.kidsnomy.group.repository.GroupMembershipRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SavingsService {

    private final SavingsRepository savingsRepository;
    private final GroupMembershipRepository groupMembershipRepository;

    public SavingsService(SavingsRepository savingsRepository,
                          GroupMembershipRepository groupMembershipRepository) {
        this.savingsRepository = savingsRepository;
        this.groupMembershipRepository = groupMembershipRepository;
    }

    public void createSavings(Long userId, SavingsCreateRequestDto requestDto) {

        if (!groupMembershipRepository.existsByGroupIdAndUserId(requestDto.getGroupId(), userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인이 속한 그룹이 아닙니다.");
        }

        if (requestDto.getGroupId() == null || requestDto.getInterestRate() == null ||
                requestDto.getDueDate() == null || requestDto.getRateDate() == null || requestDto.getPayDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "필수 입력값이 누락되었습니다.");
        }

        Savings savings = new Savings(
                requestDto.getGroupId(),
                userId,
                requestDto.getTitle(),
                requestDto.getContent(),
                requestDto.getInterestRate(),
                requestDto.getDueDate(),
                requestDto.getRateDate(),
                requestDto.getPayDate()
        );

        savingsRepository.save(savings);
    }
}
