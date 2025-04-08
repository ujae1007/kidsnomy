package com.backend.kidsnomy.finance.dto;

public class ApiResponseDto {

    private final String status;    // "success" or "error"
    private final String message;   // 응답 메시지
    private final Object data;      // 추가 데이터 (선택적)

    // 생성자 (데이터 없는 경우)
    public ApiResponseDto(String status, String message) {
        this.status = status;
        this.message = message;
        this.data = null;
    }

    // 생성자 (데이터 있는 경우)
    public ApiResponseDto(String status, String message, Object data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    // Getter만 제공 (불변성 유지)
    public String getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public Object getData() {
        return data;
    }
}
