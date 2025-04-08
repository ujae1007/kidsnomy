package com.backend.kidsnomy.finance.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "savings_log")
public class SavingsLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "transaction_unique_no", nullable = false, unique = true)
    private String transactionUniqueNo;

    @Column(name = "transaction_date")
    private String transactionDate;

    @Column(name = "transaction_time")
    private String transactionTime;

    @Column(name = "transaction_type")
    private Boolean transactionType;

    @Column(name = "transaction_balance", precision = 15, scale = 2)
    private BigDecimal transactionBalance;

    @Column(name = "transaction_after_balance", precision = 15, scale = 2)
    private BigDecimal transactionAfterBalance;

    @Column(name = "transaction_summary", length = 255)
    private String transactionSummary;

    @Column(name = "transaction_memo", length = 255)
    private String transactionMemo;

    @Column(name = "product_type")
    private Byte productType = 1;

    public SavingsLog() {}

    // Getters
    public Integer getId() { return id; }
    public String getTransactionUniqueNo() { return transactionUniqueNo; }
    public String getTransactionDate() { return transactionDate; }
    public String getTransactionTime() { return transactionTime; }
    public Boolean getTransactionType() { return transactionType; }
    public BigDecimal getTransactionBalance() { return transactionBalance; }
    public BigDecimal getTransactionAfterBalance() { return transactionAfterBalance; }
    public String getTransactionSummary() { return transactionSummary; }
    public String getTransactionMemo() { return transactionMemo; }
    public Byte getProductType() { return productType; }

    // Setters
    public void setId(Integer id) { this.id = id; }
    public void setTransactionUniqueNo(String transactionUniqueNo) { this.transactionUniqueNo = transactionUniqueNo; }
    public void setTransactionDate(String transactionDate) { this.transactionDate = transactionDate; }
    public void setTransactionTime(String transactionTime) { this.transactionTime = transactionTime; }
    public void setTransactionType(Boolean transactionType) { this.transactionType = transactionType; }
    public void setTransactionBalance(BigDecimal transactionBalance) { this.transactionBalance = transactionBalance; }
    public void setTransactionAfterBalance(BigDecimal transactionAfterBalance) { this.transactionAfterBalance = transactionAfterBalance; }
    public void setTransactionSummary(String transactionSummary) { this.transactionSummary = transactionSummary; }
    public void setTransactionMemo(String transactionMemo) { this.transactionMemo = transactionMemo; }
    public void setProductType(Byte productType) { this.productType = productType; }
}