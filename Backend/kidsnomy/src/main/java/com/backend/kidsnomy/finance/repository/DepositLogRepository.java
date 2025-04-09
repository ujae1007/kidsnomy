package com.backend.kidsnomy.finance.repository;

import com.backend.kidsnomy.finance.entity.DepositLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DepositLogRepository extends JpaRepository<DepositLog, Long> {

    // 거래 고유번호로 조회
    Optional<DepositLog> findByTransactionUniqueNo(String transactionUniqueNo);

    // 거래 유형별 조회 (0: 출금, 1: 입금)
    List<DepositLog> findByTransactionType(Boolean transactionType);

    // 상품 타입별 조회 (0: 예금, 1: 적금)
    List<DepositLog> findByProductType(Byte productType);

    // 특정 기간 내 거래 내역 조회
    @Query("SELECT d FROM DepositLog d " +
            "WHERE d.transactionDate BETWEEN :start AND :end " +
            "ORDER BY d.transactionDate DESC")
    List<DepositLog> findByTransactionDateBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    // 계좌번호 + 거래유형 조회 (커스텀 쿼리)
    @Query("SELECT d FROM DepositLog d " +
            "WHERE d.transactionSummary LIKE %:accountNo% " +
            "AND d.transactionType = :transactionType")
    List<DepositLog> findByAccountAndType(
            @Param("accountNo") String accountNo,
            @Param("transactionType") Boolean transactionType
    );
}
