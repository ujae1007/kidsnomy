package com.backend.kidsnomy.basic.dto;

import jakarta.validation.constraints.NotBlank;

public class AccountTransactionRequestDto {

    @NotBlank(message = "계좌번호는 필수입니다")
    private String accountNo;

    private String startDate;

    private String endDate;

    private String transactionType = "A"; // 기본: 전체
    private String orderByType = "DESC";  // 기본: 내림차순

    public AccountTransactionRequestDto() {}

    // 생성자, getter, setter 생략 안 함
    public AccountTransactionRequestDto(String accountNo, String startDate, String endDate, String transactionType, String orderByType) {
        this.accountNo = accountNo;
        this.startDate = startDate;
        this.endDate = endDate;
        this.transactionType = transactionType;
        this.orderByType = orderByType;
    }

    public String getAccountNo() { return accountNo; }
    public void setAccountNo(String accountNo) { this.accountNo = accountNo; }
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    public String getOrderByType() { return orderByType; }
    public void setOrderByType(String orderByType) { this.orderByType = orderByType; }
}
