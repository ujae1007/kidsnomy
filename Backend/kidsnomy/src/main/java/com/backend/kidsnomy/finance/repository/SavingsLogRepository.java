package com.backend.kidsnomy.finance.repository;

import com.backend.kidsnomy.finance.entity.SavingsLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SavingsLogRepository extends JpaRepository<SavingsLog, Long> {

    // 거래 고유번호로 조회
    Optional<SavingsLog> findByTransactionUniqueNo(String transactionUniqueNo);

    // 거래 유형별 조회 (0: 출금, 1: 입금)
    List<SavingsLog> findByTransactionType(Boolean transactionType);

    // 상품 타입별 조회 (0: 예금, 1: 적금)
    List<SavingsLog> findByProductType(Byte productType);

    // 특정 기간 내 거래 내역 조회
    @Query("SELECT s FROM SavingsLog s " +
            "WHERE s.transactionDate BETWEEN :start AND :end " +
            "ORDER BY s.transactionDate DESC")
    List<SavingsLog> findByTransactionDateBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    // 계좌번호 + 거래유형 조회 (커스텀 쿼리)
    @Query("SELECT s FROM SavingsLog s " +
            "WHERE s.transactionSummary LIKE %:accountNo% " +
            "AND s.transactionType = :transactionType")
    List<SavingsLog> findByAccountAndType(
            @Param("accountNo") String accountNo,
            @Param("transactionType") Boolean transactionType
    );
}