package com.backend.kidsnomy.user.repository;

import com.backend.kidsnomy.user.entity.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {

    Optional<EmailVerification> findByEmail(String email);

    boolean existsByEmailAndVerificationCode(String email, int code);
}