package com.backend.kidsnomy.user.dto;

public class EmailVerificationDto {
    private String email;
    private int verificationCode;

    public EmailVerificationDto() {}
    public EmailVerificationDto(String email, int verificationCode) {
        this.email = email;
        this.verificationCode = verificationCode;
    }

    public String getEmail() { return email; }
    public int getVerificationCode() { return verificationCode; }
}
