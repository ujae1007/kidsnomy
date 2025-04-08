package com.backend.kidsnomy.user.controller;

import com.backend.kidsnomy.jwt.JwtTokenProvider;
import com.backend.kidsnomy.jwt.dto.LoginResponseDto;
import com.backend.kidsnomy.jwt.dto.TokenDto;
import com.backend.kidsnomy.user.dto.ApiResponseDto;
import com.backend.kidsnomy.user.dto.EmailSendRequestDto;
import com.backend.kidsnomy.user.dto.EmailVerificationDto;
import com.backend.kidsnomy.user.dto.LoginRequestDto;
import com.backend.kidsnomy.user.dto.SignUpChildRequestDto;
import com.backend.kidsnomy.user.dto.SignUpParentRequestDto;
import com.backend.kidsnomy.user.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    public UserController(UserService userService, JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    // 1. 이메일 인증 코드 전송
    @PostMapping("/verification")
    public ResponseEntity<String> sendEmailCode(@RequestBody EmailSendRequestDto dto) {
        try {
            userService.sendEmailVerificationCode(dto.getEmail());
            return ResponseEntity.ok("인증 코드가 전송되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("서버 오류: " + e.getMessage());
        }
    }

    // 2. 인증 코드 검증
    @PostMapping("/verification/email")
    public ResponseEntity<ApiResponseDto> verifyEmailCode(@RequestBody EmailVerificationDto dto) {
        boolean success = userService.verifyCode(dto);

        if (success) {
            return ResponseEntity.ok(new ApiResponseDto(true, "이메일 인증이 완료되었습니다."));
        } else {
            return ResponseEntity
                .badRequest()
                .body(new ApiResponseDto(false, "인증 코드가 일치하지 않습니다."));
        }
    }

    // 3. 부모 회원가입
    @PostMapping("/signup/parent")
    public ResponseEntity<String> registerParent(@RequestBody SignUpParentRequestDto dto) {
        try {
            userService.registerParent(dto);
            return ResponseEntity.ok("회원가입이 완료되었습니다.");
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
        	e.printStackTrace(); // ✅ 에러 로그 콘솔에 출력
            return ResponseEntity.internalServerError().body("회원가입 중 오류가 발생했습니다.");
        }
    }
    
    // 4. 자녀 회원가입
    @PostMapping("/signup/child")
    public ResponseEntity<String> registerChild(@RequestBody SignUpChildRequestDto dto) {
        try {
            userService.registerChild(dto);
            return ResponseEntity.ok("자녀 회원가입이 완료되었습니다.");
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("자녀 회원가입 중 오류가 발생했습니다.");
        }
    }
    
    // 5. 로그인
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto dto, HttpServletResponse response) {
        LoginResponseDto token = userService.login(dto, response);
        return ResponseEntity.ok(token);
    }
    
   
 // 6. 토큰 reissue
    @PostMapping("/reissue")
    public ResponseEntity<TokenDto> reissue(
            HttpServletRequest request,
            HttpServletResponse response,
            @CookieValue(name = "refreshToken", required = false) String refreshToken
    ) {
        String accessToken = jwtTokenProvider.resolveAccessToken(request);

        if (accessToken == null || refreshToken == null) {
            return ResponseEntity.badRequest().build();
        }

        TokenDto token = userService.reissue(accessToken, refreshToken, response);
        return ResponseEntity.ok(token);
    }

    
    // 7. 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        userService.logout(request, response);
        return ResponseEntity.ok("로그아웃 되었습니다.");
    }
    
    // 8. 회원탈퇴
    @DeleteMapping("/signout")
    public ResponseEntity<String> deleteMe(HttpServletRequest request, HttpServletResponse response) {
        userService.deleteMe(request, response);
        return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
    }

}
