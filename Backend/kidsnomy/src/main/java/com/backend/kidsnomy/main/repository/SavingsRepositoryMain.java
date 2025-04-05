package com.backend.kidsnomy.main.repository;

import com.backend.kidsnomy.main.entity.SavingsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavingsRepositoryMain extends JpaRepository<SavingsEntity, Long> {

    // 부모가 만든 적금 상품
    List<SavingsEntity> findByUserIdAndGroupId(Long userId, Long groupId);
}
