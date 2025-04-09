package com.backend.kidsnomy.main.service;

import com.backend.kidsnomy.basic.service.BasicAccountService;
import com.backend.kidsnomy.main.dto.*;
import com.backend.kidsnomy.main.entity.*;
import com.backend.kidsnomy.main.repository.*;
import com.backend.kidsnomy.user.entity.User;
import com.backend.kidsnomy.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MainPageService {

    private final UserRepository userRepository;
    private final BasicAccountRepositorMain accountRepository;
    private final JobRepositoryMain jobRepository;
    private final DepositRepositoryMain depositRepository;
    private final DepositContractRepositoryMain depositContractRepository;
    private final SavingsRepositoryMain savingsRepository;
    private final SavingsContractRepositoryMain savingsContractRepository;
    private final BasicAccountService basicAccountService;

    public MainPageService(UserRepository userRepository,
                           BasicAccountRepositorMain accountRepository,
                           JobRepositoryMain jobRepository,
                           DepositRepositoryMain depositRepository,
                           DepositContractRepositoryMain depositContractRepository,
                           SavingsRepositoryMain savingsRepository,
                           SavingsContractRepositoryMain savingsContractRepository,
                           BasicAccountService basicAccountService) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.jobRepository = jobRepository;
        this.depositRepository = depositRepository;
        this.depositContractRepository = depositContractRepository;
        this.savingsRepository = savingsRepository;
        this.savingsContractRepository = savingsContractRepository;
        this.basicAccountService = basicAccountService;
    }

    public MainPageResponseDto getMainPageInfo(String email, Long groupId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자 정보를 찾을 수 없습니다."));
        Long userId = user.getId();
        boolean isParent = user.getIsParent();

        // 계좌 정보 - 먼저 외부 API로 잔액 최신화
        try {
            basicAccountService.refreshBalance(userId);
        } catch (Exception e) {
            System.out.println("계좌 잔액 최신화 실패: " + e.getMessage());
            // 실패해도 계속 진행
        }

        AccountDto account = accountRepository.findByUserId(userId)
                .map(this::toAccountDto)
                .orElse(null);

        // 일자리
        List<JobDto> jobs;
        try {
            jobs = isParent
                    ? jobRepository.findByEmployerIdAndGroupId(userId, groupId).stream().map(this::toJobDto).collect(Collectors.toList())
                    : jobRepository.findByEmployeeIdAndGroupId(userId, groupId).stream().map(this::toJobDto).collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("일자리 조회 실패: " + e.getMessage());
            jobs = List.of(); // 빈 리스트 반환
        }

        // 예금
        List<DepositDto> deposits = isParent
                ? depositRepository.findByUserIdAndGroupId(userId, groupId).stream().map(this::toDepositDto).collect(Collectors.toList())
                : List.of();

        List<DepositContractDto> depositContracts = isParent
                ? List.of()
                : depositContractRepository.findByUserIdAndGroupId(userId, groupId).stream().map(this::toDepositContractDto).collect(Collectors.toList());

        // 적금
        List<SavingsDto> savings = isParent
                ? savingsRepository.findByUserIdAndGroupId(userId, groupId).stream().map(this::toSavingsDto).collect(Collectors.toList())
                : List.of();

        List<SavingsContractDto> savingsContracts = isParent
                ? List.of()
                : savingsContractRepository.findByUserIdAndGroupId(userId, groupId).stream().map(this::toSavingsContractDto).collect(Collectors.toList());

        // 응답 객체 생성
        MainPageResponseDto response = new MainPageResponseDto();
        response.setName(user.getName());
        response.setAccount(account);
        response.setJobs(jobs);
        response.setDeposits(deposits);
        response.setDepositContracts(depositContracts);
        response.setSavings(savings);
        response.setSavingsContracts(savingsContracts);

        return response;
    }

    private AccountDto toAccountDto(BasicAccountEntity entity) {
        return new AccountDto(
                entity.getId(),
                entity.getUserId(),
                entity.getAccountNo(),
                entity.getAccountPassword(),
                entity.getBalance(),
                entity.getCreatedAt()
        );
    }

    private JobDto toJobDto(JobEntity entity) {
        return new JobDto(
                entity.getId(),
                entity.getGroupId(),
                entity.getEmployerId(),
                entity.getEmployeeId(),
                entity.getTitle(),
                entity.getContent(),
                entity.getSalary(),
                entity.getRewardText(),
                entity.getIsPermanent(),
                entity.getStartAt(),
                entity.getEndAt(),
                entity.getStatus()
        );
    }

    private DepositDto toDepositDto(DepositEntity entity) {
        return new DepositDto(
                entity.getId(),
                entity.getGroupId(),
                entity.getUserId(),
                entity.getTitle(),
                entity.getContent(),
                entity.getInterestRate(),
                entity.getDueDate(),
                entity.getProductType()
        );
    }

    private DepositContractDto toDepositContractDto(DepositContractEntity entity) {
        return new DepositContractDto(
                entity.getId(),
                entity.getGroupId(),
                entity.getUserId(),
                entity.getProductId(),
                entity.getStartDay(),
                entity.getEndDay(),
                entity.getAccountNo(),
                entity.getBalance(),
                entity.getTotalVolume()
        );
    }

    private SavingsDto toSavingsDto(SavingsEntity entity) {
        return new SavingsDto(
                entity.getId(),
                entity.getGroupId(),
                entity.getUserId(),
                entity.getTitle(),
                entity.getContent(),
                entity.getInterestRate(),
                entity.getDueDate(),
                entity.getRateDate(),
                entity.getPayDate(),
                entity.getProductType()
        );
    }

    private SavingsContractDto toSavingsContractDto(SavingsContractEntity entity) {
        return new SavingsContractDto(
                entity.getId(),
                entity.getGroupId(),
                entity.getUserId(),
                entity.getProductId(),
                entity.getStartDay(),
                entity.getEndDay(),
                entity.getAccountNo(),
                entity.getBalance(),
                entity.getOneTimeVolume(),
                entity.getRateVolume()
        );
    }
}
