package com.backend.kidsnomy.basic.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class AccountDetailResponseDto {

    // 계좌 정보
    private String accountNo;
    private BigDecimal balance;
    private Integer accountPassword;
    private LocalDateTime createdAt;

    // 거래 내역
    private List<AccountTransactionResponseDto.TransactionDetail> transactions;

    public AccountDetailResponseDto() {}

    public AccountDetailResponseDto(String accountNo, BigDecimal balance,
                                    LocalDateTime createdAt,
                                    List<AccountTransactionResponseDto.TransactionDetail> transactions) {
        this.accountNo = accountNo;
        this.balance = balance;
        this.createdAt = createdAt;
        this.transactions = transactions;
    }

    public String getAccountNo() { return accountNo; }
    public void setAccountNo(String accountNo) { this.accountNo = accountNo; }

    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<AccountTransactionResponseDto.TransactionDetail> getTransactions() { return transactions; }
    public void setTransactions(List<AccountTransactionResponseDto.TransactionDetail> transactions) {
        this.transactions = transactions;
    }
}
