package com.backend.kidsnomy.common.enums;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    // 공통
    INTERNAL_SERVER_ERROR("C001", "서버 내부 오류", HttpStatus.INTERNAL_SERVER_ERROR.value()),
    INVALID_INPUT_VALUE("C002", "유효하지 않은 입력값", HttpStatus.BAD_REQUEST.value()),
    NO_BASIC_ACCOUNT("C003", "기본 계좌가 존재하지 않음", HttpStatus.BAD_REQUEST.value()), // 추가
    INVALID_REQUEST("C004", "잘못된 요청", HttpStatus.BAD_REQUEST.value()), // 추가

    // 외부 API 관련
    EXTERNAL_API_FAILED("E001", "외부 API 호출 실패", HttpStatus.BAD_GATEWAY.value()),
    EXTERNAL_API_TIMEOUT("E002", "외부 API 응답 시간 초과", HttpStatus.GATEWAY_TIMEOUT.value());

    private final String code;
    private final String message;
    private final int status; // 변경: int 타입으로 정의

    ErrorCode(String code, String message, int status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }

    // Getter 추가
    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public int getStatus() { // HttpStatus 대신 int 반환
        return status;
    }
}
