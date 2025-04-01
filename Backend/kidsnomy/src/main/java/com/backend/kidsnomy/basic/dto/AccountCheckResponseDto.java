package com.backend.kidsnomy.basic.dto;

import java.math.BigDecimal;

public class AccountCheckResponseDto {

    private String user_name;
    private String bankCode;
    private String accountNo;
    private BigDecimal accountBalance;
    private String accountCreatedDate;
    private String accountExpiryDate;
    private String lastTransactionDate;
    private String currency;

    // 기본 생성자
    public AccountCheckResponseDto() {}

    // 전체 필드 생성자
    public AccountCheckResponseDto(String user_name, String bankCode, String accountNo,
                                   BigDecimal accountBalance, String accountCreatedDate,
                                   String accountExpiryDate, String lastTransactionDate,
                                   String currency) {
        this.user_name = user_name;
        this.bankCode = bankCode;
        this.accountNo = accountNo;
        this.accountBalance = accountBalance;
        this.accountCreatedDate = accountCreatedDate;
        this.accountExpiryDate = accountExpiryDate;
        this.lastTransactionDate = lastTransactionDate;
        this.currency = currency;
    }

    // Getter / Setter
    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public String getBankCode() {
        return bankCode;
    }

    public void setBankCode(String bankCode) {
        this.bankCode = bankCode;
    }

    public String getAccountNo() {
        return accountNo;
    }

    public void setAccountNo(String accountNo) {
        this.accountNo = accountNo;
    }

    public BigDecimal getAccountBalance() {
        return accountBalance;
    }

    public void setAccountBalance(BigDecimal accountBalance) {
        this.accountBalance = accountBalance;
    }

    public String getAccountCreatedDate() {
        return accountCreatedDate;
    }

    public void setAccountCreatedDate(String accountCreatedDate) {
        this.accountCreatedDate = accountCreatedDate;
    }

    public String getAccountExpiryDate() {
        return accountExpiryDate;
    }

    public void setAccountExpiryDate(String accountExpiryDate) {
        this.accountExpiryDate = accountExpiryDate;
    }

    public String getLastTransactionDate() {
        return lastTransactionDate;
    }

    public void setLastTransactionDate(String lastTransactionDate) {
        this.lastTransactionDate = lastTransactionDate;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
