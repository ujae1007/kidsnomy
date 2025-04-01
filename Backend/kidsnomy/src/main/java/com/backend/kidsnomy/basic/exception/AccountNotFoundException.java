package com.backend.kidsnomy.basic.exception;

import org.springframework.http.HttpStatus;

// 계좌 조회 실패 예외 처리
public class AccountNotFoundException extends AccountException {

    public AccountNotFoundException(String message) {
        super(message);
    }

    public AccountNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    @Override
    public HttpStatus getStatusCode() {
        return HttpStatus.NOT_FOUND;
    }
}