package com.backend.kidsnomy.finance.service;

import com.backend.kidsnomy.finance.dto.DepositCreateRequestDto;
import com.backend.kidsnomy.finance.entity.Deposit;
import com.backend.kidsnomy.finance.repository.DepositRepository;

import com.backend.kidsnomy.group.repository.GroupMembershipRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DepositService {

    private final DepositRepository depositRepository;
    private final GroupMembershipRepository groupMembershipRepository;

    public DepositService(DepositRepository depositRepository, GroupMembershipRepository groupMembershipRepository) {
        this.depositRepository = depositRepository;
        this.groupMembershipRepository = groupMembershipRepository;
    }

    public void createDeposit(Long userId, DepositCreateRequestDto requestDto) {

    	if (!groupMembershipRepository.existsByGroupIdAndUserId(requestDto.getGroupId(), userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인이 속한 그룹이 아닙니다.");
        }
    	
        if (requestDto.getGroupId() == null || requestDto.getTitle() == null ||
                requestDto.getInterestRate() == null || requestDto.getDueDate() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "필수 입력값이 누락되었습니다.");
        }

        Deposit deposit = new Deposit(
                requestDto.getGroupId(),
                userId,
                requestDto.getTitle(),
                requestDto.getContent(),
                requestDto.getInterestRate(),
                requestDto.getDueDate()
        );

        depositRepository.save(deposit);
    }
}
