package com.backend.kidsnomy.basic.exception;

// 계좌 해지 예외 처리
public class AccountCloseException extends AccountException {

    public AccountCloseException(String message) {
        super(message);
    }

    public AccountCloseException(String message, Throwable cause) {
        super(message, cause);
    }
}
