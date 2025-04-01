package com.backend.kidsnomy.basic.exception;

// 계좌 생성 예외 처리
public class AccountCreationException extends AccountException {

    public AccountCreationException(String message) {
        super(message);
    }

    public AccountCreationException(String message, Throwable cause) {
        super(message, cause);
    }
}