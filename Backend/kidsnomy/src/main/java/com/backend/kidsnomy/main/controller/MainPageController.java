package com.backend.kidsnomy.main.controller;

import com.backend.kidsnomy.main.dto.MainPageResponseDto;
import com.backend.kidsnomy.main.service.MainPageService;
import com.backend.kidsnomy.jwt.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/main")
public class MainPageController {

    private final MainPageService mainPageService;
    private final JwtTokenProvider jwtTokenProvider;

    public MainPageController(MainPageService mainPageService, JwtTokenProvider jwtTokenProvider) {
        this.mainPageService = mainPageService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @GetMapping("/{groupId}")
    public MainPageResponseDto getMainPageData(@PathVariable("groupId") Long groupId, HttpServletRequest request) {
        // 1. 토큰에서 사용자 이메일 추출
        String token = jwtTokenProvider.resolveAccessToken(request);
        String email = jwtTokenProvider.getEmailFromToken(token);

        // 2. 메인 정보 조회
        return mainPageService.getMainPageInfo(email, groupId);
    }
}
