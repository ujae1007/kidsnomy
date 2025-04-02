package com.backend.kidsnomy.basic.dto;

import java.math.BigDecimal;

public class AccountCloseResponseDto {

    private String status;
    private String accountNo;
    private String refundAccountNo;
    private BigDecimal accountBalance;

    // 기본 생성자
    public AccountCloseResponseDto() {}

    // 전체 필드 생성자
    public AccountCloseResponseDto(String status, String accountNo, String refundAccountNo, BigDecimal accountBalance) {
        this.status = status;
        this.accountNo = accountNo;
        this.refundAccountNo = refundAccountNo;
        this.accountBalance = accountBalance;
    }

    // Getter / Setter
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public BigDecimal getAccountBalance() {
        return accountBalance;
    }

    public void setAccountBalance(BigDecimal accountBalance) {
        this.accountBalance = accountBalance;
    }
}
