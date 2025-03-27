package com.backend.kidsnomy.basic.service;

import com.backend.kidsnomy.basic.dto.BasicProductRequestDto;
import com.backend.kidsnomy.basic.dto.BasicProductResponseDto;
import com.backend.kidsnomy.basic.entity.BasicProduct;
import com.backend.kidsnomy.basic.repository.BasicProductRepository;
import com.backend.kidsnomy.common.util.ApiUtils;

import com.backend.kidsnomy.jwt.JwtTokenProvider;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
public class BasicProductService {

    private final BasicProductRepository basicProductRepository;
    private final RestTemplate restTemplate;
    private final String apiKey;
    private final String baseUrl;
    private final JwtTokenProvider jwtTokenProvider;

    public BasicProductService(
            BasicProductRepository basicProductRepository,
            RestTemplate restTemplate,
            @Value("${ssafy.api.apiKey}") String apiKey,
            @Value("${ssafy.api.base-url}") String baseUrl,
            JwtTokenProvider jwtTokenProvider) {
        this.basicProductRepository = basicProductRepository;
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * 수시입출금 상품 생성
     */
    public BasicProductResponseDto createProduct(HttpServletRequest request, BasicProductRequestDto requestDto) {
        // 1. access token 꺼내기
        String accessToken = jwtTokenProvider.resolveAccessToken(request);
        if (accessToken == null || !jwtTokenProvider.validateToken(accessToken)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다.");
        }

        // 이미 상품이 존재하는지 확인 (더 효율적인 방법)
        if (basicProductRepository.count() > 0) {
            // 이미 상품이 존재하면 해당 상품 정보 반환
            BasicProduct product = basicProductRepository.findAll().get(0);

            // getProductDetails 호출 대신 간단한 응답 반환
            return BasicProductResponseDto.builder()
                    .accountTypeUniqueNo(product.getAccountTypeUniqueNo())
                    .accountName(requestDto.getAccountName())
                    .accountDescription(requestDto.getAccountDescription())
                    .bankCode(requestDto.getBankCode())
                    .build();
        }


        // API 요청 준비
        String apiUrl = baseUrl + "/ssafy/api/v1/edu/demandDeposit/createDemandDeposit";

        // 요청 본문 생성
        Map<String, Object> requestBody = new HashMap<>();

        // Header 생성
        Map<String, Object> header = ApiUtils.createApiRequestHeader("createDemandDeposit", apiKey);
        requestBody.put("Header", header);

        // 요청 데이터 설정
        requestBody.put("bankCode", Objects.requireNonNullElse(requestDto.getBankCode(), "999")); // 기본값으로 싸피은행 코드 사용
        requestBody.put("accountName", requestDto.getAccountName());
        requestBody.put("accountDescription", requestDto.getAccountDescription());

        // API 호출
        HttpEntity<Map<String, Object>> httpEntity = ApiUtils.createHttpEntity(requestBody);

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

                // 응답 DTO 생성 (빌더 패턴 사용)
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

// 커스텀 예외 클래스
class ProductCreationException extends RuntimeException {
    public ProductCreationException(String message) {
        super(message);
    }

    public ProductCreationException(String message, Throwable cause) {
        super(message, cause);
    }

    // 요청 헤더에서 Bearer 토큰 추출
    public String extractTokenFromRequest(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (bearer != null && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }
}

