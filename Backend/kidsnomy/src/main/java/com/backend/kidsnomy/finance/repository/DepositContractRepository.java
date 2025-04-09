package com.backend.kidsnomy.finance.repository;

import com.backend.kidsnomy.finance.entity.DepositContract;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DepositContractRepository extends JpaRepository<DepositContract, Long> {

    // 계좌번호로 조회
    Optional<DepositContract> findByAccountNo(String accountNo);

    // 사용자 ID로 계좌 목록 조회
    List<DepositContract> findByUserId(Long userId);

    // 예금 상품 + 사용자 기준 계약 존재 여부
    boolean existsByDepositIdAndUserId(Long depositId, Long userId);

    // 상태별 계좌 조회 (0: 활성, 1: 해지)
    List<DepositContract> findByStatus(Integer status);

    // 만기일 기준 조회 (LocalDate)
    List<DepositContract> findByEndDay(LocalDate endDay);

    // [추가] 상태 + 예금 상품의 due_date 조회 (Deposit 엔티티 연동)
    List<DepositContract> findByStatusAndDeposit_DueDate(Integer status, Integer dueDate);

    // [추가] 상태 + 예금 상품 타입 조회 (Deposit 엔티티 연동)
    List<DepositContract> findByStatusAndDeposit_ProductType(Integer status, Byte productType);
}
