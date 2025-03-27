package com.backend.kidsnomy.jwt.dto;

public class LoginResponseDto {
	
    private String accessToken;
    
    private boolean isParent;

    public LoginResponseDto(String accessToken, boolean isParent) {
        this.accessToken = accessToken;
        this.isParent = isParent;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public boolean getisParent() {
        return isParent;
    }
}
