package com.backend.kidsnomy.basic.dto;

public class BasicProductResponseDto {

    private String accountTypeUniqueNo;
    private String accountName;
    private String accountDescription;
    private String bankCode;

    // 기본 생성자
    public BasicProductResponseDto() {}

    // 전체 필드 생성자
    public BasicProductResponseDto(String accountTypeUniqueNo, String accountName,
                                   String accountDescription, String bankCode) {
        this.accountTypeUniqueNo = accountTypeUniqueNo;
        this.accountName = accountName;
        this.accountDescription = accountDescription;
        this.bankCode = bankCode;
    }

    public String getAccountTypeUniqueNo() {
        return accountTypeUniqueNo;
    }

    public void setAccountTypeUniqueNo(String accountTypeUniqueNo) {
        this.accountTypeUniqueNo = accountTypeUniqueNo;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getAccountDescription() {
        return accountDescription;
    }

    public void setAccountDescription(String accountDescription) {
        this.accountDescription = accountDescription;
    }

    public String getBankCode() {
        return bankCode;
    }

    public void setBankCode(String bankCode) {
        this.bankCode = bankCode;
    }
}
