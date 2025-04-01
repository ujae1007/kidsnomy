package com.backend.kidsnomy.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * 인증 및 권한 관련 예외를 처리하기 위한 기본 예외 클래스
 * 모든 인증 관련 예외는 이 클래스 import 후 상속받아 구현하면 된다
 */
@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class AuthenticationException extends BaseException {

    public AuthenticationException(String message) {
        super(message);
    }

    public AuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }

    @Override
    public HttpStatus getStatusCode() {
        return HttpStatus.UNAUTHORIZED;
    }
}
