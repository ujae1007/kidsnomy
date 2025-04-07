package com.backend.kidsnomy.finance.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_GATEWAY)
public class ExternalTransferException extends RuntimeException {
    public ExternalTransferException(String message) {
        super("외부 계좌 이체 실패: " + message);
    }
}
