package com.backend.kidsnomy.basic.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "account_log")
public class AccountLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "account_no", nullable = false)
    private String accountNo;

    @Column(name = "transaction_account_no", length = 70)
    private String transactionAccountNo;

    @Column(name = "transaction_unique_no", nullable = false, unique = true)
    private String transactionUniqueNo;

    @Column(name = "transaction_date")
    private String transactionDate;

    @Column(name = "transaction_time")
    private String transactionTime;

    @Column(name = "transaction_type")
    private Integer transactionType;

    @Column(name = "transaction_balance")
    private BigDecimal transactionBalance;

    @Column(name = "transaction_after_balance")
    private BigDecimal transactionAfterBalance;

    @Column(name = "transaction_summary")
    private String transactionSummary;

    @Column(name = "transaction_memo")
    private String transactionMemo;

    // 기본 생성자
    public AccountLog() {}

    // 전체 필드 생성자
    public AccountLog(Integer id, Integer userId, String accountNo, String transactionAccountNo,
                      String transactionUniqueNo, String transactionDate, String transactionTime,
                      Integer transactionType, BigDecimal transactionBalance, BigDecimal transactionAfterBalance,
                      String transactionSummary, String transactionMemo) {
        this.id = id;
        this.userId = userId;
        this.accountNo = accountNo;
        this.transactionAccountNo = transactionAccountNo;
        this.transactionUniqueNo = transactionUniqueNo;
        this.transactionDate = transactionDate;
        this.transactionTime = transactionTime;
        this.transactionType = transactionType;
        this.transactionBalance = transactionBalance;
        this.transactionAfterBalance = transactionAfterBalance;
        this.transactionSummary = transactionSummary;
        this.transactionMemo = transactionMemo;
    }

    // Getter/Setter
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getAccountNo() {
        return accountNo;
    }

    public void setAccountNo(String accountNo) {
        this.accountNo = accountNo;
    }

    public String getTransactionAccountNo() {
        return transactionAccountNo;
    }

    public void setTransactionAccountNo(String transactionAccountNo) {
        this.transactionAccountNo = transactionAccountNo;
    }

    public String getTransactionUniqueNo() {
        return transactionUniqueNo;
    }

    public void setTransactionUniqueNo(String transactionUniqueNo) {
        this.transactionUniqueNo = transactionUniqueNo;
    }

    public String getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(String transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getTransactionTime() {
        return transactionTime;
    }

    public void setTransactionTime(String transactionTime) {
        this.transactionTime = transactionTime;
    }

    public Integer getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(Integer transactionType) {
        this.transactionType = transactionType;
    }

    public BigDecimal getTransactionBalance() {
        return transactionBalance;
    }

    public void setTransactionBalance(BigDecimal transactionBalance) {
        this.transactionBalance = transactionBalance;
    }

    public BigDecimal getTransactionAfterBalance() {
        return transactionAfterBalance;
    }

    public void setTransactionAfterBalance(BigDecimal transactionAfterBalance) {
        this.transactionAfterBalance = transactionAfterBalance;
    }

    public String getTransactionSummary() {
        return transactionSummary;
    }

    public void setTransactionSummary(String transactionSummary) {
        this.transactionSummary = transactionSummary;
    }

    public String getTransactionMemo() {
        return transactionMemo;
    }

    public void setTransactionMemo(String transactionMemo) {
        this.transactionMemo = transactionMemo;
    }
}
