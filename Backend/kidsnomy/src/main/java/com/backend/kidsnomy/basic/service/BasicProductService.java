package com.backend.kidsnomy.basic.service;

import com.backend.kidsnomy.basic.dto.BasicProductRequestDto;
import com.backend.kidsnomy.basic.dto.BasicProductResponseDto;
import com.backend.kidsnomy.basic.entity.BasicProduct;
import com.backend.kidsnomy.basic.repository.BasicProductRepository;
import com.backend.kidsnomy.common.util.ApiUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class BasicProductService {

    @Autowired
    private BasicProductRepository basicProductRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${ssafy.api.key}")
    private String apiKey;

    @Value("${ssafy.api.base-url}")
    private String baseUrl;

    /**
     * 수시입출금 상품 생성
     */
    public BasicProductResponseDto createProduct(BasicProductRequestDto requestDto) {
        // 이미 상품이 존재하는지 확인
        Optional<BasicProduct> existingProduct = basicProductRepository.findAll().stream().findFirst();
        if (existingProduct.isPresent()) {
            // 이미 상품이 존재하면 해당 상품 정보 반환
            BasicProduct product = existingProduct.get();
            return getProductDetails(product.getAccountTypeUniqueNo());
        }

        // API 요청 준비
        String apiUrl = baseUrl + "/ssafy/api/v1/edu/demandDeposit/createDemandDeposit";

        // 요청 본문 생성
        Map<String, Object> requestBody = new HashMap<>();

        // Header 생성
        Map<String, Object> header = ApiUtils.createApiRequestHeader("createDemandDeposit", apiKey);
        requestBody.put("Header", header);

        // 요청 데이터 설정
        requestBody.put("bankCode", requestDto.getBankCode() != null ? requestDto.getBankCode() : "999"); // 기본값으로 싸피은행 코드 사용
        requestBody.put("accountName", requestDto.getAccountName());
        requestBody.put("accountDescription", requestDto.getAccountDescription());

        // API 호출
        HttpEntity<Map<String, Object>> httpEntity = ApiUtils.createHttpEntity(requestBody);
        Map<String, Object> response = restTemplate.postForObject(apiUrl, httpEntity, Map.class);

        // 응답 처리
        if (response != null && response.containsKey("REC")) {
            Map<String, Object> rec = (Map<String, Object>) response.get("REC");
            String accountTypeUniqueNo = (String) rec.get("accountTypeUniqueNo");

            // DB에 저장
            BasicProduct product = new BasicProduct();
            product.setAccountTypeUniqueNo(accountTypeUniqueNo);
            basicProductRepository.save(product);

            // 응답 DTO 생성
            BasicProductResponseDto responseDto = new BasicProductResponseDto();
            responseDto.setAccountTypeUniqueNo(accountTypeUniqueNo);
            responseDto.setAccountName((String) rec.get("accountName"));
            responseDto.setAccountDescription((String) rec.get("accountDescription"));
            responseDto.setBankCode((String) rec.get("bankCode"));

            return responseDto;
        }

        throw new RuntimeException("상품 생성에 실패했습니다.");
    }

    /**
     * 수시입출금 상품 조회
     */
    public BasicProductResponseDto getProduct(Long id) {
        BasicProduct product = basicProductRepository.findById(id.intValue())
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        return getProductDetails(product.getAccountTypeUniqueNo());
    }

    /**
     * 상품 상세 정보 조회
     */
    private BasicProductResponseDto getProductDetails(String accountTypeUniqueNo) {
        // API 요청 준비
        String apiUrl = baseUrl + "/ssafy/api/v1/edu/demandDeposit/inquireDemandDepositList";

        // 요청 본문 생성
        Map<String, Object> requestBody = new HashMap<>();

        // Header 생성
        Map<String, Object> header = ApiUtils.createApiRequestHeader("inquireDemandDepositList", apiKey);
        requestBody.put("Header", header);

        // API 호출
        HttpEntity<Map<String, Object>> httpEntity = ApiUtils.createHttpEntity(requestBody);
        Map<String, Object> response = restTemplate.postForObject(apiUrl, httpEntity, Map.class);

        // 응답 처리
        if (response != null && response.containsKey("REC")) {
            Object recObj = response.get("REC");
            if (recObj instanceof java.util.List) {
                java.util.List<Map<String, Object>> recList = (java.util.List<Map<String, Object>>) recObj;

                // accountTypeUniqueNo와 일치하는 상품 찾기
                for (Map<String, Object> rec : recList) {
                    if (accountTypeUniqueNo.equals(rec.get("accountTypeUniqueNo"))) {
                        BasicProductResponseDto responseDto = new BasicProductResponseDto();
                        responseDto.setAccountTypeUniqueNo((String) rec.get("accountTypeUniqueNo"));
                        responseDto.setAccountName((String) rec.get("accountName"));
                        responseDto.setAccountDescription((String) rec.get("accountDescription"));
                        responseDto.setBankCode((String) rec.get("bankCode"));
                        return responseDto;
                    }
                }
            }
        }

        throw new RuntimeException("상품 정보를 조회할 수 없습니다.");
    }
}
