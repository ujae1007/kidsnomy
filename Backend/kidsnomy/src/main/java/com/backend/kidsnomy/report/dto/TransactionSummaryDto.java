package com.backend.kidsnomy.report.dto;

import java.math.BigDecimal;

public class TransactionSummaryDto {
    private String transactionDate;
    private int transactionType;
    private BigDecimal transactionBalance;
    private String transactionSummary;

    // 생성자, Getter, Setter
    public TransactionSummaryDto() {}

    public TransactionSummaryDto(String transactionDate, int transactionType, BigDecimal transactionBalance, String transactionSummary) {
        this.transactionDate = transactionDate;
        this.transactionType = transactionType;
        this.transactionBalance = transactionBalance;
        this.transactionSummary = transactionSummary;
    }

    public String getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(String transactionDate) {
        this.transactionDate = transactionDate;
    }

    public int getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(int transactionType) {
        this.transactionType = transactionType;
    }

    public BigDecimal getTransactionBalance() {
        return transactionBalance;
    }

    public void setTransactionBalance(BigDecimal transactionBalance) {
        this.transactionBalance = transactionBalance;
    }

    public String getTransactionSummary() {
        return transactionSummary;
    }

    public void setTransactionSummary(String transactionSummary) {
        this.transactionSummary = transactionSummary;
    }
}
