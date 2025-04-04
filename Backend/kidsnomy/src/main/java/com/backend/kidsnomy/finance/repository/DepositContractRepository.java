package com.backend.kidsnomy.finance.repository;

import com.backend.kidsnomy.finance.entity.DepositContract;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepositContractRepository extends JpaRepository<DepositContract, Long> {

    // 계좌번호로 조회
    Optional<DepositContract> findByAccountNo(String accountNo);

    // 사용자 ID로 계좌 목록 조회
    List<DepositContract> findByUserId(Long userId);

    // 사용자가 선택한 예금 상품을 이미 계약한 상태인지 검증 (중복 검증 방지)
    boolean existsByDepositIdAndUserId(Long depositId, Long userId);
}
