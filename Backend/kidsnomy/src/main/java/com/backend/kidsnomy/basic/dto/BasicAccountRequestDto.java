package com.backend.kidsnomy.basic.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class BasicAccountRequestDto {

    @NotNull(message = "계좌 비밀번호는 필수입니다")
    @Min(value = 1000, message = "계좌 비밀번호는 4자리여야 합니다")
    @Max(value = 9999, message = "계좌 비밀번호는 4자리여야 합니다")
    private Integer accountPassword;

    // 기본 생성자
    public BasicAccountRequestDto() {}

    // 전체 필드 생성자
    public BasicAccountRequestDto(Integer accountPassword) {
        this.accountPassword = accountPassword;
    }

    public Integer getAccountPassword() {
        return accountPassword;
    }

    public void setAccountPassword(Integer accountPassword) {
        this.accountPassword = accountPassword;
    }
}
