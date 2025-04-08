package com.backend.kidsnomy.chatbot.service;

import com.backend.kidsnomy.chatbot.dto.ChatRequestDto;
import com.backend.kidsnomy.chatbot.dto.ChatResponseDto;

import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriUtils;

@Service
public class ChatService {

    private final RestTemplate restTemplate;

    @Value("${fastapi.chatbot.url}")
    private String fastapiUrl;

    public ChatService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ChatResponseDto sendMessageToFastApi(ChatRequestDto request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON); // JSON 전송 명시

        HttpEntity<ChatRequestDto> entity = new HttpEntity<>(request, headers);

        System.out.println("요청 URL: " + fastapiUrl);
        System.out.println("요청 Body: " + entity.getBody());
        System.out.println("요청 Headers: " + entity.getHeaders());
    

        return restTemplate.postForObject(fastapiUrl, entity, ChatResponseDto.class);
    }
}
