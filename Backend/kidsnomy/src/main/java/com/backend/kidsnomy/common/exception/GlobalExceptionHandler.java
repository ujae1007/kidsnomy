package com.backend.kidsnomy.common.exception;

import com.backend.kidsnomy.common.dto.ErrorResponse;
import com.backend.kidsnomy.common.enums.ErrorCode;
import com.backend.kidsnomy.finance.exception.NoBasicAccountException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

@ControllerAdvice
public class GlobalExceptionHandler {

    // 기존 Spring 예외 처리
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatusException(ResponseStatusException ex) {
        ErrorResponse response = new ErrorResponse(
                ErrorCode.INVALID_REQUEST,
                ex.getReason() != null ? ex.getReason() : "요청 처리 실패"
        );
        return ResponseEntity.status(ex.getStatusCode()).body(response);
    }

    // 커스텀 예외 처리
    @ExceptionHandler(NoBasicAccountException.class)
    public ResponseEntity<ErrorResponse> handleNoBasicAccount(NoBasicAccountException ex) {
        ErrorResponse response = new ErrorResponse(
                ErrorCode.NO_BASIC_ACCOUNT,
                ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // 외부 API 예외 처리
    @ExceptionHandler(ExternalApiException.class)
    public ResponseEntity<ErrorResponse> handleExternalApiException(ExternalApiException ex) {
        ErrorResponse response = new ErrorResponse(
                ex.getErrorCode(),
                ex.getMessage()
        );
        return ResponseEntity.status(ex.getErrorCode().getStatus()).body(response);
    }

    // 그 외 모든 예외 처리
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex) {
        ErrorResponse response = new ErrorResponse(
                ErrorCode.INTERNAL_SERVER_ERROR,
                "서버 내부 오류가 발생했습니다: " + ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
