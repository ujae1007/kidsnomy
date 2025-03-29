package com.backend.kidsnomy.common.service;

import com.backend.kidsnomy.jwt.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.naming.AuthenticationException;

@Service
@RequiredArgsConstructor
public class TokenService {
    private final JwtTokenProvider jwtTokenProvider;

    public String extractToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (bearer != null && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }

    public String validateAndGetToken(HttpServletRequest request) {
        String token = extractToken(request);
        if (token == null) {
            throw new AuthenticationException("인증 토큰이 없습니다.");
        }

        if (!jwtTokenProvider.validateToken(token)) {
            throw new AuthenticationException("유효하지 않은 토큰입니다.");
        }

        return token;
    }

    public String getUserEmailFromRequest(HttpServletRequest request) {
        String token = validateAndGetToken(request);
        return jwtTokenProvider.getEmailFromToken(token);
    }
}
