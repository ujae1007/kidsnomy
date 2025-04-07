package com.backend.kidsnomy.main.repository;

import com.backend.kidsnomy.main.entity.DepositContractEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepositContractRepositoryMain extends JpaRepository<DepositContractEntity, Long> {

    // 아이가 계약한 예금 상품
    List<DepositContractEntity> findByUserIdAndGroupId(Long userId, Long groupId);
}
