package com.backend.kidsnomy.basic.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Entity
@Table(name = "basic_account")
public class BasicAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "account_no", nullable = false, unique = true)
    private String accountNo;

    @Column(name = "account_password")
    private Integer accountPassword;

    @Column
    private BigDecimal balance = BigDecimal.ZERO;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public BasicAccount() {
        // 기본 생성자
    }

    // 전체 필드 생성자
    public BasicAccount(Long id, Long userId, String accountNo, Integer accountPassword,
                        BigDecimal balance, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.accountNo = accountNo;
        this.accountPassword = accountPassword;
        this.balance = balance != null ? balance : BigDecimal.ZERO;
        this.createdAt = createdAt;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
    }

    // Getter / Setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getAccountNo() {
        return accountNo;
    }

    public void setAccountNo(String accountNo) {
        this.accountNo = accountNo;
    }

    public Integer getAccountPassword() {
        return accountPassword;
    }

    public void setAccountPassword(Integer accountPassword) {
        this.accountPassword = accountPassword;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
