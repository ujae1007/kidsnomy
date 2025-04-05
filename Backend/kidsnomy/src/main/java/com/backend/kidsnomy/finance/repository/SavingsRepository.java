package com.backend.kidsnomy.finance.repository;

import com.backend.kidsnomy.finance.entity.Savings;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavingsRepository extends JpaRepository<Savings, Long> {

    // 그룹 ID로 적금 상품 조회
    List<Savings> findByGroupId(Long groupId);

    // 사용자 ID로 생성된 적금 상품 조회
    List<Savings> findByUserId(Long userId);

    // 상품명으로 조회
    Optional<Savings> findByTitle(String title);
}
