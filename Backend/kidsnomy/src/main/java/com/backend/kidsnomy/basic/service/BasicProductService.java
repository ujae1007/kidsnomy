package com.backend.kidsnomy.basic.service;

import com.backend.kidsnomy.basic.dto.BasicProductRequestDto;
import com.backend.kidsnomy.basic.dto.BasicProductResponseDto;
import com.backend.kidsnomy.basic.entity.BasicProduct;
import com.backend.kidsnomy.basic.exception.ProductCreationException;
import com.backend.kidsnomy.basic.repository.BasicProductRepository;
import com.backend.kidsnomy.jwt.JwtTokenProvider;
import com.backend.kidsnomy.common.exception.AuthenticationException;
import com.backend.kidsnomy.common.service.UserKeyService;
import com.backend.kidsnomy.common.util.ApiUtils;

import com.backend.kidsnomy.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class BasicProductService {

    private final BasicProductRepository basicProductRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserKeyService userKeyService;
    private final String apiKey;
    private final String baseUrl;

    public BasicProductService(
            BasicProductRepository basicProductRepository,
            UserRepository userRepository,
            RestTemplate restTemplate,
            JwtTokenProvider jwtTokenProvider,
            UserKeyService userKeyService,
            @Value("${ssafy.api.apiKey}") String apiKey,
            @Value("${ssafy.api.base-url}") String baseUrl) {
        this.basicProductRepository = basicProductRepository;
        this.userRepository = userRepository;
        this.restTemplate = restTemplate;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userKeyService = userKeyService;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    /**
     * 수시입출금 상품 생성
     */
    public BasicProductResponseDto createProduct(HttpServletRequest request, BasicProductRequestDto requestDto) {
        // 사용자 인증 및 이메일 추출
        String token = jwtTokenProvider.resolveAccessToken(request);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            throw new AuthenticationException("유효하지 않은 토큰입니다.");
        }
        // 이메일 → userId 추출
        String email = jwtTokenProvider.getEmailFromToken(token);
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthenticationException("해당 이메일을 가진 사용자를 찾을 수 없습니다."))
                .getId();

        // 이메일로 userKey 조회
        String userKey = userKeyService.getUserKeyByEmail(email);

        // SSAFY API 요청 준비
        String apiUrl = baseUrl + "/ssafy/api/v1/edu/demandDeposit/createDemandDeposit";

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> header = ApiUtils.createApiRequestHeader("createDemandDeposit", apiKey, userKey);
        requestBody.put("Header", header);
        System.out.println(requestBody.get("Header"));
        requestBody.put("bankCode", Objects.requireNonNullElse(requestDto.getBankCode(), "999"));
        requestBody.put("accountName", requestDto.getAccountName());
        requestBody.put("accountDescription", requestDto.getAccountDescription());

        HttpEntity<Map<String, Object>> httpEntity = ApiUtils.createHttpEntity(requestBody, userKey);

        try {
            Map<String, Object> response = restTemplate.postForObject(apiUrl, httpEntity, Map.class);

            if (response != null && response.containsKey("REC")) {
                Map<String, Object> rec = (Map<String, Object>) response.get("REC");
                String accountTypeUniqueNo = (String) rec.get("accountTypeUniqueNo");

                // 5. DB 저장
                BasicProduct product = new BasicProduct();
                product.setAccountTypeUniqueNo(accountTypeUniqueNo);
                basicProductRepository.save(product);

                // 6. 응답 반환
                return new BasicProductResponseDto(
                        accountTypeUniqueNo,
                        (String) rec.get("accountName"),
                        (String) rec.get("accountDescription"),
                        (String) rec.get("bankCode")
                );
            }

            throw new ProductCreationException("상품 생성 응답에 REC 필드가 없습니다.");
        } catch (Exception e) {
            throw new ProductCreationException("상품 생성에 실패했습니다: " + e.getMessage(), e);
        }
    }
}
