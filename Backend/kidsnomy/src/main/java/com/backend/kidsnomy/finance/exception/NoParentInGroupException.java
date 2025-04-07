package com.backend.kidsnomy.finance.exception;

public class NoParentInGroupException extends RuntimeException {
    public NoParentInGroupException(String message) {
        super(message);
    }
}
