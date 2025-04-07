package com.backend.kidsnomy.basic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.backend.kidsnomy.basic.entity.BasicAccount;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<BasicAccount, Long> {
    Optional<BasicAccount> findByUserId(Long userId);
}
