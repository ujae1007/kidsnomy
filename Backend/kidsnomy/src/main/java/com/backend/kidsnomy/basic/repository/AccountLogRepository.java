package com.backend.kidsnomy.basic.repository;

import com.backend.kidsnomy.basic.entity.AccountLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AccountLogRepository extends JpaRepository<AccountLog, Integer> {

    // 계좌번호로 거래 내역 조회
    List<AccountLog> findByAccountNo(String accountNo);

    // 계좌번호와 거래 일자 범위로 거래 내역 조회
    List<AccountLog> findByAccountNoAndTransactionDateBetweenOrderByTransactionDateDesc(
            String accountNo, LocalDateTime startDate, LocalDateTime endDate);

    // 거래 고유 번호로 거래 내역 조회
    AccountLog findByTransactionUniqueNo(String transactionUniqueNo);

    // 거래 중복 내역 확인
    boolean existsByTransactionUniqueNo(String transactionUniqueNo);

}
