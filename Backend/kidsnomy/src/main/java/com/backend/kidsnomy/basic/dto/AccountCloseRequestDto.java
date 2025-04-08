package com.backend.kidsnomy.basic.dto;

import jakarta.validation.constraints.NotBlank;

public class AccountCloseRequestDto {

    @NotBlank(message = "계좌번호는 필수입니다")
    private String accountNo;

    private String refundAccountNo; // 잔액이 있는 경우 필수

    // 기본 생성자
    public AccountCloseRequestDto() {}

    // 전체 필드 생성자
    public AccountCloseRequestDto(String accountNo, String refundAccountNo) {
        this.accountNo = accountNo;
        this.refundAccountNo = refundAccountNo;
    }

    public String getAccountNo() {
        return accountNo;
    }

    public void setAccountNo(String accountNo) {
        this.accountNo = accountNo;
    }

    public String getRefundAccountNo() {
        return refundAccountNo;
    }

    public void setRefundAccountNo(String refundAccountNo) {
        this.refundAccountNo = refundAccountNo;
    }
}
