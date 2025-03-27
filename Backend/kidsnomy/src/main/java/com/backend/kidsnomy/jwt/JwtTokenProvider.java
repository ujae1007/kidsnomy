package com.backend.kidsnomy.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${spring.jwt.secret}")
    private String secretKey;

    @Value("${spring.jwt.access-expiration}")
    private long accessTokenValidTime;

    @Value("${spring.jwt.refresh-expiration}")
    private long refreshTokenValidTime;

    private Key key;

    @PostConstruct
    protected void init() {
        byte[] keyBytes = Base64.getEncoder().encode(secretKey.getBytes());
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    // access token 생성
    public String createAccessToken(String email) {
        return createToken(email, accessTokenValidTime);
    }

    // refresh token 생성
    public String createRefreshToken(String email) {
        return createToken(email, refreshTokenValidTime);
    }

    // JWT 생성 공통 로직
    private String createToken(String subject, long tokenValidTime) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + tokenValidTime);

        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("만료된 토큰입니다.");
        } catch (JwtException | IllegalArgumentException e) {
            System.out.println("잘못된 토큰입니다.");
        }
        return false;
    }

    // 토큰에서 사용자 email 추출
    public String getEmailFromToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (ExpiredJwtException e) {
            // 만료된 access token 에서도 subject(email)은 꺼낼 수 있어!
            return e.getClaims().getSubject();
        }
    }
    
    // 요청에서 Authorization 헤더로부터 토큰 추출
    public String resolveAccessToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (bearer != null && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }
}
