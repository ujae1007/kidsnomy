package com.backend.kidsnomy.common.exception;

import com.backend.kidsnomy.common.enums.ErrorCode;

public class CustomException extends RuntimeException {
    private final ErrorCode errorCode;
    private final String detailMessage;

    public CustomException(ErrorCode errorCode) {
        this.errorCode = errorCode;
        this.detailMessage = errorCode.getMessage();
    }

    public CustomException(ErrorCode errorCode, String detailMessage) {
        this.errorCode = errorCode;
        this.detailMessage = detailMessage;
    }

    @Override
    public String getMessage() {
        return String.format("[%s] %s", errorCode.getCode(), detailMessage);
    }

    // Getter 추가
    public ErrorCode getErrorCode() {
        return errorCode;
    }

    public String getDetailMessage() {
        return detailMessage;
    }
}