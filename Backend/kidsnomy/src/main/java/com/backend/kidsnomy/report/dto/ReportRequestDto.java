package com.backend.kidsnomy.report.dto;

import java.util.List;
import java.util.Map;

public class ReportRequestDto {

    private String accountNo;
    private Map<String, List<TransactionSummaryDto>> weeklyTransactions;

    public ReportRequestDto(String accountNo, Map<String, List<TransactionSummaryDto>> weeklyTransactions) {
        this.accountNo = accountNo;
        this.weeklyTransactions = weeklyTransactions;
    }

    public String getAccountNo() {
        return accountNo;
    }

    public void setAccountNo(String accountNo) {
        this.accountNo = accountNo;
    }

    public Map<String, List<TransactionSummaryDto>> getWeeklyTransactions() {
        return weeklyTransactions;
    }

    public void setWeeklyTransactions(Map<String, List<TransactionSummaryDto>> weeklyTransactions) {
        this.weeklyTransactions = weeklyTransactions;
    }
}
