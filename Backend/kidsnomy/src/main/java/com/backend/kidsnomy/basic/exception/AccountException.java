package com.backend.kidsnomy.basic.exception;

import com.backend.kidsnomy.common.exception.BaseException;
import org.springframework.http.HttpStatus;


// 계좌 관련 예외(생성, 조회, 해지) 처리 클래스
public class AccountException extends BaseException {

    public AccountException(String message) {
        super(message);
    }

    public AccountException(String message, Throwable cause) {
        super(message, cause);
    }

    @Override
    public HttpStatus getStatusCode() {
        return HttpStatus.BAD_REQUEST; // 기본값 400
    }
}
