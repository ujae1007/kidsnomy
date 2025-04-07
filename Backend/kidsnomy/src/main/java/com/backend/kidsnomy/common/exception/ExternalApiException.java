package com.backend.kidsnomy.common.exception;

import com.backend.kidsnomy.common.enums.ErrorCode;

public class ExternalApiException extends RuntimeException {

    private final ErrorCode errorCode;

    // 기존 생성자: ErrorCode를 받음
    public ExternalApiException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    // 새로운 생성자: 메시지(String)를 받음
    public ExternalApiException(String message) {
        super(message);
        this.errorCode = null; // ErrorCode가 없을 경우 null 처리
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
