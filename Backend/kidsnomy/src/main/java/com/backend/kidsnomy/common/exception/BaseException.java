package com.backend.kidsnomy.common.exception;

import org.springframework.http.HttpStatus;

/**
 * 애플리케이션의 모든 커스텀 예외의 기본 클래스
 * 모든 도메인별 예외 클래스는 이 클래스 import 후 구체적인 내용 구현
 */
public abstract class BaseException extends RuntimeException {

    public BaseException(String message) {
        super(message);
    }

    public BaseException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * 예외에 해당하는 HTTP 상태 코드를 반환
     * import한 하위 클래스에서 구현하면 되는 부분
     */
    public abstract HttpStatus getStatusCode();
}
