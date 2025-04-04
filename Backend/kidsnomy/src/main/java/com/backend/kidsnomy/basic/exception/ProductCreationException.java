package com.backend.kidsnomy.basic.exception;

public class ProductCreationException extends AccountException {

    public ProductCreationException(String message) {
        super(message);
    }

    public ProductCreationException(String message, Throwable cause) {
        super(message, cause);
    }
}