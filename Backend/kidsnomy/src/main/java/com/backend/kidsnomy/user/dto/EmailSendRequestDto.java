package com.backend.kidsnomy.user.dto;

public class EmailSendRequestDto {
    private String email;

    public EmailSendRequestDto() {}

    public EmailSendRequestDto(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }
}
