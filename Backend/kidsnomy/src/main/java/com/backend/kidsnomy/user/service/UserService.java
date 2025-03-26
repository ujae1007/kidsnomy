package com.backend.kidsnomy.user.service;

import com.backend.kidsnomy.jwt.JwtTokenProvider;
import com.backend.kidsnomy.jwt.dto.TokenDto;
import com.backend.kidsnomy.jwt.entity.UserRefreshToken;
import com.backend.kidsnomy.jwt.repository.UserRefreshTokenRepository;
import com.backend.kidsnomy.user.dto.EmailVerificationDto;
import com.backend.kidsnomy.user.dto.LoginRequestDto;
import com.backend.kidsnomy.user.dto.SignUpChildRequestDto;
import com.backend.kidsnomy.user.dto.SignUpParentRequestDto;
import com.backend.kidsnomy.user.entity.EmailVerification;
import com.backend.kidsnomy.user.entity.User;
import com.backend.kidsnomy.user.repository.EmailVerificationRepository;
import com.backend.kidsnomy.user.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final EmailVerificationRepository emailVerificationRepository;
    private final JavaMailSender mailSender;
    private final BCryptPasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRefreshTokenRepository userRefreshTokenRepository;

    @Value("${external.api.apiKey}")
    private String apiKey;

    @Value("${external.api.member.url}")
    private String memberRegisterUrl;

    public UserService(UserRepository userRepository,
            EmailVerificationRepository emailVerificationRepository,
            JavaMailSender mailSender,
            RestTemplate restTemplate,
            JwtTokenProvider jwtTokenProvider,
            UserRefreshTokenRepository userRefreshTokenRepository) {
		this.userRepository = userRepository;
		this.emailVerificationRepository = emailVerificationRepository;
		this.mailSender = mailSender;
		this.passwordEncoder = new BCryptPasswordEncoder();
		this.restTemplate = restTemplate;
		this.jwtTokenProvider = jwtTokenProvider;
		this.userRefreshTokenRepository = userRefreshTokenRepository;
		}


    // 1. 이메일 인증 코드 전송
    public void sendEmailVerificationCode(String email) {
        //먼저 이메일 중복 체크
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }
        
        int code = generateCode();

        EmailVerification verification = emailVerificationRepository.findByEmail(email)
                .map(ev -> {
                    ev.setVerificationCode(code);
                    ev.setStatus(false);
                    return ev;
                })
                .orElse(new EmailVerification(email, code));

        emailVerificationRepository.save(verification);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("[Kidsnomy] 이메일 인증 코드입니다.");
        message.setText("인증 코드: " + code);

        mailSender.send(message);
    }

    // 2. 이메일 인증 확인
    public boolean verifyCode(EmailVerificationDto dto) {
        Optional<EmailVerification> optional = emailVerificationRepository.findByEmail(dto.getEmail());

        if (optional.isPresent() && optional.get().getVerificationCode() == dto.getVerificationCode()) {
            EmailVerification verification = optional.get();
            verification.setStatus(true);
            emailVerificationRepository.save(verification);
            return true;
        }

        return false;
    }

    // 3. 부모 회원가입 처리
    @Transactional
    public void registerParent(SignUpParentRequestDto dto) {
        // 1. 이메일 인증 여부 확인
        EmailVerification verification = emailVerificationRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("이메일 인증이 필요합니다."));

        if (!verification.getStatus()) {
            throw new IllegalStateException("이메일이 인증되지 않았습니다.");
        }

        // 2. 이메일 중복 확인
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("해당 이메일은 이미 사용 중입니다.");
        }

        // 3. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(dto.getPassword());

        // 4. 외부 API 요청 → userKey 받아오기
        String userKey = registerToExternalApi(dto.getEmail());

        // 5. 유저 저장
        User user = new User(
                dto.getEmail(),
                encodedPassword,
                dto.getName(),
                true, // isParent
                dto.getAge(),
                dto.getGender(),
                userKey
        );

        userRepository.save(user);
    }

    // 외부 금융망 API 호출 → userKey 반환
    private String registerToExternalApi(String email) {
        ExternalUserRequest request = new ExternalUserRequest(apiKey, email);
        
        try {
            ExternalUserResponse response = restTemplate.postForObject(
                    memberRegisterUrl,
                    request,
                    ExternalUserResponse.class
            );

            if (response != null && email.equals(response.getUserId())) {
                return response.getUserKey(); // 👉 DB에 저장할 값
            } else {
                throw new RuntimeException("외부 API 응답이 비정상입니다.");
            }

        } catch (Exception e) {
            throw new RuntimeException("외부 API 호출 실패: " + e.getMessage());
        }
    }

    // 인증 코드 생성 (6자리)
    private int generateCode() {
        return new Random().nextInt(900000) + 100000;
    }

    // 외부 API 요청 바디 DTO
    static class ExternalUserRequest {
        private String apiKey;
        private String userId;

        public ExternalUserRequest(String apiKey, String userId) {
            this.apiKey = apiKey;
            this.userId = userId;
        }

        public String getApiKey() {
            return apiKey;
        }

        public String getUserId() {
            return userId;
        }
    }

    // 외부 API 응답 DTO
    static class ExternalUserResponse {
        private String userId;
        private String userKey;

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public String getUserKey() {
            return userKey;
        }

        public void setUserKey(String userKey) {
            this.userKey = userKey;
        }
    }
    
    @Transactional
    public void registerChild(SignUpChildRequestDto dto) {
        // 부모 이메일 존재 여부 확인
        if (!userRepository.existsByEmail(dto.getParentEmail())) {
            throw new IllegalArgumentException("존재하지 않는 부모 이메일입니다.");
        }
    	
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("해당 이메일은 이미 사용 중입니다.");
        }

        String encodedPassword = passwordEncoder.encode(dto.getPassword());
        String userKey = registerToExternalApi(dto.getEmail());

        User child = new User(
                dto.getEmail(),
                encodedPassword,
                dto.getName(),
                false, // isParent = false (아이 회원가입이기 때문)
                dto.getAge(),
                dto.getGender(),
                userKey
        );
        child.setParentEmail(dto.getParentEmail());

        userRepository.save(child);
    }
    
    @Transactional
    public TokenDto login(LoginRequestDto dto, HttpServletResponse response) {
        // 1. 사용자 조회
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

        // 2. 비밀번호 확인
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        // 3. 토큰 생성
        String accessToken = jwtTokenProvider.createAccessToken(user.getEmail());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getEmail());

        // 4. Refresh Token DB 저장
        UserRefreshToken token = userRefreshTokenRepository.findByUserId(user.getId())
                .orElse(new UserRefreshToken());
        token.setUserId(user.getId());
        token.setRefreshToken(refreshToken);
        token.setCreatedAt(LocalDateTime.now());
        token.setExpiredAt(LocalDateTime.now().plusDays(1)); // 1일 유효

        userRefreshTokenRepository.save(token);

        // 5. Refresh Token → 쿠키로 내려줌
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/api/auth")
                .sameSite("None")
                .maxAge(86400) // 1일 = 60*60*24
                .build();

        response.setHeader("Set-Cookie", cookie.toString());

        // 6. access token 반환
        return new TokenDto(accessToken);
    }

    // 토큰 reissue 관련 메서드
    @Transactional
    public TokenDto reissue(String accessToken, String refreshToken) {
        // 1. access token에서 이메일 추출 (만료돼도 subject는 꺼낼 수 있음)
        String email = jwtTokenProvider.getEmailFromToken(accessToken);

        // 2. 사용자 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 3. DB에서 refresh token 조회
        UserRefreshToken savedToken = userRefreshTokenRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("저장된 리프레시 토큰이 없습니다."));

        // 4. 일치 여부 확인
        if (!savedToken.getRefreshToken().equals(refreshToken)) {
            throw new IllegalArgumentException("Refresh Token이 유효하지 않습니다.");
        }

        // 5. 만료 확인
        if (savedToken.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Refresh Token이 만료되었습니다. 다시 로그인해주세요.");
        }

        // 6. 새로운 access token 발급
        String newAccessToken = jwtTokenProvider.createAccessToken(email);
        return new TokenDto(newAccessToken);
    }
    
    // 로그아웃 + refresh token 삭제 + Cookie에 있는 refresh token 만료
    @Transactional
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        // 1. access token 꺼내기
        String accessToken = jwtTokenProvider.resolveAccessToken(request);
        if (accessToken == null || !jwtTokenProvider.validateToken(accessToken)) {
            throw new IllegalArgumentException("유효하지 않은 토큰입니다.");
        }

        // 2. 사용자 이메일 추출
        String email = jwtTokenProvider.getEmailFromToken(accessToken);

        // 3. 사용자 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 존재하지 않습니다."));

        // 4. refresh token DB 삭제
        userRefreshTokenRepository.findByUserId(user.getId())
                .ifPresent(userRefreshTokenRepository::delete);

        // 5. refresh token 쿠키 만료 설정
        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/api/auth")
                .maxAge(0) // 즉시 만료
                .sameSite("None")
                .build();

        response.setHeader("Set-Cookie", deleteCookie.toString());
    }

    // 회원탈퇴
    @Transactional
    public void deleteMe(HttpServletRequest request, HttpServletResponse response) {
        String accessToken = jwtTokenProvider.resolveAccessToken(request);
        if (accessToken == null || !jwtTokenProvider.validateToken(accessToken)) {
            throw new IllegalArgumentException("유효하지 않은 access token입니다.");
        }

        String email = jwtTokenProvider.getEmailFromToken(accessToken);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 존재하지 않습니다."));

        // 1. refresh token 삭제 (DB)
        userRefreshTokenRepository.findByUserId(user.getId())
                .ifPresent(userRefreshTokenRepository::delete);

        // 2. 사용자 삭제
        userRepository.delete(user);  // ✅ 연관 데이터는 ON DELETE CASCADE로 자동 삭제됨

        // 3. refreshToken 쿠키 제거
        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/api/auth")
                .maxAge(0)
                .sameSite("None")
                .build();

        response.setHeader("Set-Cookie", deleteCookie.toString());
    }
}
