package com.backend.kidsnomy.main.repository;

import com.backend.kidsnomy.main.entity.SavingsContractEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavingsContractRepositoryMain extends JpaRepository<SavingsContractEntity, Long> {

    // 아이가 계약한 적금 상품
    List<SavingsContractEntity> findByUserIdAndGroupId(Long userId, Long groupId);
}
