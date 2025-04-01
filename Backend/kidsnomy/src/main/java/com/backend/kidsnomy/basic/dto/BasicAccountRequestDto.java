package com.backend.kidsnomy.basic.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class BasicAccountRequestDto {

    @NotNull(message = "사용자 ID는 필수입니다")
    private Integer userId;

    @NotNull(message = "상품 고유번호는 필수입니다")
    private String accountTypeUniqueNo;

    @NotNull(message = "계좌 비밀번호는 필수입니다")
    @Min(value = 1000, message = "계좌 비밀번호는 4자리여야 합니다")
    @Max(value = 9999, message = "계좌 비밀번호는 4자리여야 합니다")
    private Integer accountPassword;

    // 기본 생성자
    public BasicAccountRequestDto() {}

    // 전체 필드 생성자
    public BasicAccountRequestDto(Integer userId, String accountTypeUniqueNo, Integer accountPassword) {
        this.userId = userId;
        this.accountTypeUniqueNo = accountTypeUniqueNo;
        this.accountPassword = accountPassword;
    }

    // Getter / Setter
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getAccountTypeUniqueNo() {
        return accountTypeUniqueNo;
    }

    public void setAccountTypeUniqueNo(String accountTypeUniqueNo) {
        this.accountTypeUniqueNo = accountTypeUniqueNo;
    }

    public Integer getAccountPassword() {
        return accountPassword;
    }

    public void setAccountPassword(Integer accountPassword) {
        this.accountPassword = accountPassword;
    }
}
