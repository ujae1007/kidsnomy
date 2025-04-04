package com.backend.kidsnomy.common.exception;

import com.backend.kidsnomy.finance.exception.NoBasicAccountException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> handleResponseStatusException(ResponseStatusException ex) {
        return ResponseEntity.status(ex.getStatusCode())
                .body("{\"error\": \"" + ex.getReason() + "\"}");
    }

    @ExceptionHandler(NoBasicAccountException.class)
    public ResponseEntity<ErrorResponse> handleNoBasicAccount(NoBasicAccountException ex) {
        ErrorResponse errorResponse = ErrorResponse.builder(ex, HttpStatus.BAD_REQUEST, ex.getMessage())
                .type(URI.create("https://example.com/errors/no-basic-account")) // 에러 타입 URI (선택 사항)
                .title("No Basic Account Found") // 제목 (선택 사항)
                .detail(ex.getMessage()) // 상세 메시지
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
}
