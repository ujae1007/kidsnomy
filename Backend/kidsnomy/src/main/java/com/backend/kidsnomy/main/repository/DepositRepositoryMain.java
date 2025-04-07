package com.backend.kidsnomy.main.repository;

import com.backend.kidsnomy.main.entity.DepositEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepositRepositoryMain extends JpaRepository<DepositEntity, Long> {

    // 부모가 생성한 예금 상품 (userId 기준)
    List<DepositEntity> findByUserIdAndGroupId(Long userId, Long groupId);
}
