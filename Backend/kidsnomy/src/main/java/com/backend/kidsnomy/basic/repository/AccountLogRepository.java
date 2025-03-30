package com.backend.kidsnomy.basic.repository;

import com.backend.kidsnomy.basic.entity.AccountLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountLogRepository extends JpaRepository<AccountLog, Integer> {

    // 계좌번호로 모든 거래 내역 조회 (최신순 정렬)
    @Query("SELECT a FROM AccountLog a WHERE a.accountNo = :accountNo ORDER BY a.transactionDate DESC, a.transactionTime DESC")
    List<AccountLog> findAllByAccountNoOrderByLatest(@Param("accountNo") String accountNo);

    // 거래 중복 내역 확인
    boolean existsByTransactionUniqueNo(String transactionUniqueNo);

    // 최종 거래 내역 조회 (lastTransactionDate 처리용)
    Optional<AccountLog> findTopByAccountNoOrderByTransactionDateDescTransactionTimeDesc(String accountNo);

    /**
     * 프론트엔드 무한 스크롤 기능 구현 시 성능 문제 해결 위한 부분
     * 데이터가 적다면 삭제해도 된다
     * 계좌번호로 거래 내역 페이징 조회 (무한 스크롤 지원)
     */
    @Query("SELECT a FROM AccountLog a WHERE a.accountNo = :accountNo ORDER BY a.transactionDate DESC, a.transactionTime DESC")
    Page<AccountLog> findAllByAccountNoPaged(@Param("accountNo") String accountNo, Pageable pageable);
}
