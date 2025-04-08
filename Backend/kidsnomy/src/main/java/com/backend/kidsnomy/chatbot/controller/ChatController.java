package com.backend.kidsnomy.chatbot.controller;

import com.backend.kidsnomy.chatbot.dto.ChatRequestDto;
import com.backend.kidsnomy.chatbot.dto.ChatResponseDto;
import com.backend.kidsnomy.chatbot.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public ResponseEntity<ChatResponseDto> chat(@RequestBody ChatRequestDto request) {
        ChatResponseDto response = chatService.sendMessageToFastApi(request);
        System.out.println(response);
        return ResponseEntity.ok(response);
    }
}
