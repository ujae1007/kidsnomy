package com.backend.kidsnomy.basic.repository;

import com.backend.kidsnomy.basic.entity.BasicAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BasicAccountRepository extends JpaRepository<BasicAccount, Integer> {

    // 계좌번호로 계좌 조회
    Optional<BasicAccount> findByAccountNo(String accountNo);

    // 사용자 ID로 계좌 목록 조회
    List<BasicAccount> findByUserId(Long userId);

    // 사용자 ID로 첫 번째 계좌 조회
    Optional<BasicAccount> findFirstByUserId(Long userId);

    // 사용자 ID로 계좌 존재 여부 확인
    boolean existsByUserId(Long userId);

    // 계좌번호 존재 여부 확인
    boolean existsByAccountNo(String accountNo);

    // 계좌번호로 계좌 삭제 (계좌 해지 기능)
    @Transactional
    void deleteByAccountNo(String accountNo);

    // 계좌번호로 계좌 조회 및 잔액 확인
    @Query("SELECT b.balance FROM BasicAccount b WHERE b.accountNo = :accountNo")
    Optional<BigDecimal> findBalanceByAccountNo(String accountNo);
}

