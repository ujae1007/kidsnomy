package com.backend.kidsnomy.basic.service;

import com.backend.kidsnomy.basic.dto.BasicProductRequestDto;
import com.backend.kidsnomy.basic.dto.BasicProductResponseDto;
import com.backend.kidsnomy.basic.entity.BasicProduct;
import com.backend.kidsnomy.basic.exception.ProductCreationException;
import com.backend.kidsnomy.basic.repository.BasicProductRepository;
import com.backend.kidsnomy.common.exception.AuthenticationException;
import com.backend.kidsnomy.jwt.JwtTokenProvider;
import com.backend.kidsnomy.common.util.ApiUtils;
import com.backend.kidsnomy.common.service.UserKeyService;

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
    private final RestTemplate restTemplate;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserKeyService userKeyService;

    private final String apiKey;
    private final String baseUrl;

    public BasicProductService(
            BasicProductRepository basicProductRepository,
            RestTemplate restTemplate,
            JwtTokenProvider jwtTokenProvider,
            UserKeyService userKeyService,
            @Value("${ssafy.api.apiKey}") String apiKey,
            @Value("${ssafy.api.base-url}") String baseUrl) {
        this.basicProductRepository = basicProductRepository;
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
        // 1. 사용자 이메일 가져오기
        // JwtTokenProvider 직접 사용
        String token = jwtTokenProvider.resolveAccessToken(request);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            throw new AuthenticationException("유효하지 않은 토큰입니다.");
        }
        String email = jwtTokenProvider.getEmailFromToken(token);

        // 2. 이메일로 userKey 조회
        String userKey = userKeyService.getUserKeyByEmail(email);

        // 이미 상품이 존재하는지 확인
        if (basicProductRepository.count() > 0) {
            BasicProduct product = basicProductRepository.findAll().get(0);
            return BasicProductResponseDto.builder()
                    .accountTypeUniqueNo(product.getAccountTypeUniqueNo())
                    .accountName(requestDto.getAccountName())
                    .accountDescription(requestDto.getAccountDescription())
                    .bankCode(requestDto.getBankCode())
                    .build();
        }

        // SSAFY API 요청 준비
        String apiUrl = baseUrl + "/ssafy/api/v1/edu/demandDeposit/createDemandDeposit";

        // 요청 본문 생성
        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> header = ApiUtils.createApiRequestHeader("createDemandDeposit", apiKey, userKey);
        requestBody.put("Header", header);

        // SSAFY API 요청 Body 생성
        requestBody.put("bankCode", Objects.requireNonNullElse(requestDto.getBankCode(), "999"));
        requestBody.put("accountName", requestDto.getAccountName());
        requestBody.put("accountDescription", requestDto.getAccountDescription());

        // API 호출
        HttpEntity<Map<String, Object>> httpEntity = ApiUtils.createHttpEntity(requestBody, userKey);

        try {
            Map<String, Object> response = restTemplate.postForObject(apiUrl, httpEntity, Map.class);

            // 응답 처리
            if (response != null && response.containsKey("REC")) {
                Map<String, Object> rec = (Map<String, Object>) response.get("REC");
                String accountTypeUniqueNo = (String) rec.get("accountTypeUniqueNo");

                // DB에 저장
                BasicProduct product = BasicProduct.builder()
                        .accountTypeUniqueNo(accountTypeUniqueNo)
                        .build();
                basicProductRepository.save(product);

                // 응답 DTO 생성
                return BasicProductResponseDto.builder()
                        .accountTypeUniqueNo(accountTypeUniqueNo)
                        .accountName((String) rec.get("accountName"))
                        .accountDescription((String) rec.get("accountDescription"))
                        .bankCode((String) rec.get("bankCode"))
                        .build();
            }

            throw new ProductCreationException("상품 생성 응답에 REC 필드가 없습니다.");
        } catch (Exception e) {
            throw new ProductCreationException("상품 생성에 실패했습니다: " + e.getMessage(), e);
        }
    }
}
