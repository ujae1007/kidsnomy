package com.backend.kidsnomy.finance.repository;

import com.backend.kidsnomy.finance.entity.SavingsContract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavingsContractRepository extends JpaRepository<SavingsContract, Long> {

    // 계좌번호로 조회
    Optional<SavingsContract> findByAccountNo(String accountNo);

    // 사용자 ID로 계좌 목록 조회
    List<SavingsContract> findByUserId(Long userId);

    // 입금 주기별 계좌 조회
    List<SavingsContract> findByOneTimeVolume(BigDecimal oneTimeVolume);

    // 사용자가 선택한 적금 상품을 이미 계약한 상태인지 검증 (중복 검증 방지)
    boolean existsBySavingsIdAndUserId(Long savingsId, Long userId);
}
