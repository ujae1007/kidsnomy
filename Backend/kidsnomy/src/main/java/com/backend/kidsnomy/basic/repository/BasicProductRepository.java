package com.backend.kidsnomy.basic.repository;

import com.backend.kidsnomy.basic.entity.BasicProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BasicProductRepository extends JpaRepository<BasicProduct, Integer> {

    // 상품 고유 번호로 상품 조회
    Optional<BasicProduct> findByAccountTypeUniqueNo(String accountTypeUniqueNo);

    // 상품이 존재하는지 확인
    boolean existsByAccountTypeUniqueNo(String accountTypeUniqueNo);
}