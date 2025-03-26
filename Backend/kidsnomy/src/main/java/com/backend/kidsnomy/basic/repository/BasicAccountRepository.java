package com.backend.kidsnomy.basic.repository;

import com.backend.kidsnomy.basic.entity.BasicAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BasicAccountRepository extends JpaRepository<BasicAccount, Integer> {

    // 계좌번호로 계좌 조회
    Optional<BasicAccount> findByAccountNo(String accountNo);

    // 사용자 ID로 계좌 목록 조회
    List<BasicAccount> findByUserId(Integer userId);

    // 계좌번호 존재 여부 확인
    boolean existsByAccountNo(String accountNo);
}
