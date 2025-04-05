package com.backend.kidsnomy.main.repository;

import com.backend.kidsnomy.main.entity.BasicAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BasicAccountRepositorMain extends JpaRepository<BasicAccountEntity, Long> {
    Optional<BasicAccountEntity> findByUserId(Long userId);
}
