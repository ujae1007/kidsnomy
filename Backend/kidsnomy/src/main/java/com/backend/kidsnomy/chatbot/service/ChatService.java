package com.backend.kidsnomy.chatbot.service;

import com.backend.kidsnomy.chatbot.dto.ChatRequestDto;
import com.backend.kidsnomy.chatbot.dto.ChatResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ChatService {

    private final RestTemplate restTemplate;

    @Value("${fastapi.chatbot.url}")
    private String fastapiUrl;

    public ChatService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ChatResponseDto sendMessageToFastApi(ChatRequestDto request) {
        return restTemplate.postForObject(fastapiUrl, request, ChatResponseDto.class);
    }
}
