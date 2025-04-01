package com.backend.kidsnomy.chatbot.dto;

public class ChatResponseDto {
    private String response;

    public ChatResponseDto() {}

    public ChatResponseDto(String response) {
        this.response = response;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }
}
