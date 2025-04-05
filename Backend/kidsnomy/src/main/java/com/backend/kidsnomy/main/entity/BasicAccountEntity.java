package com.backend.kidsnomy.main.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "basic_account")
public class BasicAccountEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "account_no", nullable = false, unique = true)
    private String accountNo;

    @Column(name = "account_password")
    private Integer accountPassword;

    @Column(name = "balance")
    private BigDecimal balance;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public BasicAccountEntity() {}

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getAccountNo() { return accountNo; }
    public Integer getAccountPassword() { return accountPassword; }
    public BigDecimal getBalance() { return balance; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setUserId(Long userId) { this.userId = userId; }
    public void setAccountNo(String accountNo) { this.accountNo = accountNo; }
    public void setAccountPassword(Integer accountPassword) { this.accountPassword = accountPassword; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
