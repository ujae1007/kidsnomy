package com.backend.kidsnomy.jwt.scheduler;

import com.backend.kidsnomy.jwt.entity.UserRefreshToken;
import com.backend.kidsnomy.jwt.repository.UserRefreshTokenRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class RefreshTokenCleanupScheduler {

    private final UserRefreshTokenRepository refreshTokenRepository;

    public RefreshTokenCleanupScheduler(UserRefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    // 매 10초마다 만료된 리프레시 토큰 삭제
    @Scheduled(fixedDelay = 10000) // 10초마다 실행
    public void deleteExpiredTokens() {
        System.out.println("▶ 리프레시 토큰 정리 시작");

        List<UserRefreshToken> allTokens = refreshTokenRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        allTokens.stream()
                .filter(token -> token.getExpiredAt().isBefore(now))
                .forEach(token -> {
                    refreshTokenRepository.delete(token);
                    System.out.println("삭제됨: " + token.getId());
                });
    }
}
