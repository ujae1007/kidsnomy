package com.backend.kidsnomy.basic.dto;

import java.math.BigDecimal;

public class BasicAccountResponseDto {

    private String accountNo;
    private BigDecimal balance;

    // 기본 생성자
    public BasicAccountResponseDto() {}

    // 전체 필드 생성자
    public BasicAccountResponseDto(String accountNo, BigDecimal balance) {
        this.accountNo = accountNo;
        this.balance = balance;
    }

    public String getAccountNo() {
        return accountNo;
    }

    public void setAccountNo(String accountNo) {
        this.accountNo = accountNo;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
}
