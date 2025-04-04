package com.backend.kidsnomy.common.util;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.time.ZoneId;

public class ApiUtils {

    public static Map<String, Object> createApiRequestHeader(String apiName, String apiKey, String userKey) {
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
        String transmissionDate = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String transmissionTime = now.format(DateTimeFormatter.ofPattern("HHmmss"));
        String transactionUniqueNo = generateTransactionUniqueNo(transmissionDate, transmissionTime);

        Map<String, Object> header = new HashMap<>();
        header.put("apiName", apiName);
        header.put("transmissionDate", transmissionDate);
        header.put("transmissionTime", transmissionTime);
        header.put("institutionCode", "00100");
        header.put("fintechAppNo", "001");
        header.put("apiServiceCode", apiName);
        header.put("institutionTransactionUniqueNo", transactionUniqueNo);
        header.put("apiKey", apiKey);
        header.put("userKey", userKey); // ✅ userKey 추가
        return header;
    }

    public static String generateTransactionUniqueNo(String date, String time) {
        String sequenceNumber = String.format("%06d", new Random().nextInt(1000000));
        return date + time + sequenceNumber;
    }

    public static HttpEntity<Map<String, Object>> createHttpEntity(Map<String, Object> requestBody, String userKey) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("userKey", userKey); // ✅ HTTP Header에도 userKey 추가
        return new HttpEntity<>(requestBody, headers);
    }
}