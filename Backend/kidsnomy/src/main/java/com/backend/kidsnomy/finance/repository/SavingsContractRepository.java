package com.backend.kidsnomy.finance.repository;

import com.backend.kidsnomy.finance.entity.Savings;
import com.backend.kidsnomy.finance.entity.SavingsContract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SavingsContractRepository extends JpaRepository<SavingsContract, Long> {

    // 계좌번호로 조회
    Optional<SavingsContract> findByAccountNo(String accountNo);

    // 사용자 ID로 계좌 목록 조회
    List<SavingsContract> findByUserId(Long userId);

    // 사용자가 선택한 적금 상품을 이미 계약한 상태인지 검증 (중복 검증 방지)
    boolean existsBySavingsIdAndUserId(Long savingsId, Long userId);

    // 적금 계약 조회
    Optional<SavingsContract> findByIdAndUserId(Long id, Long userId);

    // 상태별 계좌 조회 (활성/해지)
    List<SavingsContract> findByStatus(Integer status);

    // [스케줄링을 위한 커스텀 쿼리]
    // 1. 만기일 기준 조회 (LocalDate 타입)
    List<SavingsContract> findByEndDay(LocalDate endDay);

    // 2. 상태 + 납입일 조회 (int 타입)
//    List<SavingsContract> findByStatusAndPayDate(int status, int payDate);
    List<SavingsContract> findByStatusAndSavings_PayDate(int status, int payDate);
    // 3. 상태 + 이자 지급일 조회 (int 타입)
//    List<SavingsContract> findByStatusAndRateDate(int status, int rateDate);
    List<SavingsContract> findByStatusAndSavings_RateDate(int status, int rateDate);
}
