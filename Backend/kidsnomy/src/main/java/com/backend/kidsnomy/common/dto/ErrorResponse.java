package com.backend.kidsnomy.common.dto;

import com.backend.kidsnomy.common.enums.ErrorCode;

import java.time.LocalDateTime;

public class ErrorResponse {
    private final LocalDateTime timestamp; // 에러 발생 시각
    private final int status; // HTTP 상태 코드
    private final String code; // 에러 코드
    private final String message; // 에러 메시지

    public ErrorResponse(ErrorCode errorCode) {
        this.timestamp = LocalDateTime.now();
        this.status = errorCode.getStatus();
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
    }

    public ErrorResponse(ErrorCode errorCode, String detailMessage) {
        this.timestamp = LocalDateTime.now();
        this.status = errorCode.getStatus();
        this.code = errorCode.getCode();
        this.message = detailMessage;
    }

    // Getter 메서드 추가
    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
