package com.backend.kidsnomy.finance.exception;

public class NoBasicAccountException extends RuntimeException {
    public NoBasicAccountException(String message) {
        super(message);
    }
}
