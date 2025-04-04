package com.backend.kidsnomy.finance.repository;

import com.backend.kidsnomy.finance.entity.Deposit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepositRepository extends JpaRepository<Deposit, Long> {

    // 그룹 ID로 예금 상품 조회
    List<Deposit> findByGroupId(Long groupId);

    // 사용자 ID로 생성된 예금 상품 조회
    List<Deposit> findByUserId(Long userId);

    // 상품명으로 조회
    Optional<Deposit> findByTitle(String title);
}