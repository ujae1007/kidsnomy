package com.backend.kidsnomy.report.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

@Repository
public class ReportResponseDto {
    private String accountNo;
    private Map<String, List<TransactionSummaryDto>> weeklyTransactions;
    private BigDecimal averageWithdrawalRate;

    public ReportResponseDto() {}

    public ReportResponseDto(String accountNo, Map<String, List<TransactionSummaryDto>> weeklyTransactions, BigDecimal averageWithdrawalRate) {
        this.accountNo = accountNo;
        this.weeklyTransactions = weeklyTransactions;
        this.averageWithdrawalRate = averageWithdrawalRate;
    }

    public String getAccountNo() {
        return accountNo;
    }

    public Map<String, List<TransactionSummaryDto>> getWeeklyTransactions() {
        return weeklyTransactions;
    }

    public BigDecimal getAverageWithdrawalRate() {
        return averageWithdrawalRate;
    }

    public void setAccountNo(String accountNo) {
        this.accountNo = accountNo;
    }

    public void setWeeklyTransactions(Map<String, List<TransactionSummaryDto>> weeklyTransactions) {
        this.weeklyTransactions = weeklyTransactions;
    }

    public void setAverageWithdrawalRate(BigDecimal averageWithdrawalRate) {
        this.averageWithdrawalRate = averageWithdrawalRate;
    }
}
