package com.backend.kidsnomy.basic.dto;

import jakarta.validation.constraints.NotBlank;

public class AccountCheckRequestDto {

    @NotBlank(message = "계좌번호는 필수입니다")
    private String accountNo;

    public AccountCheckRequestDto() {}

    public AccountCheckRequestDto(String accountNo) {
        this.accountNo = accountNo;
    }

    public String getAccountNo() {
        return accountNo;
    }

    public void setAccountNo(String accountNo) {
        this.accountNo = accountNo;
    }
}
