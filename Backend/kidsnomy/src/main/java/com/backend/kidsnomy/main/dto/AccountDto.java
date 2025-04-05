package com.backend.kidsnomy.main.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AccountDto {
    private Long id;
    private Long userId;
    private String accountNo;
    private Integer accountPassword;
    private BigDecimal balance;
    private LocalDateTime createdAt;

    public AccountDto() {}

    public AccountDto(Long id, Long userId, String accountNo, Integer accountPassword,
                      BigDecimal balance, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.accountNo = accountNo;
        this.accountPassword = accountPassword;
        this.balance = balance;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getAccountNo() { return accountNo; }
    public Integer getAccountPassword() { return accountPassword; }
    public BigDecimal getBalance() { return balance; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setAccountNo(String accountNo) { this.accountNo = accountNo; }
    public void setAccountPassword(Integer accountPassword) { this.accountPassword = accountPassword; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
