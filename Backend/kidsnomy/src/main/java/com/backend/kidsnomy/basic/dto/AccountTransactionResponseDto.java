package com.backend.kidsnomy.basic.dto;

import java.math.BigDecimal;
import java.util.List;

public class AccountTransactionResponseDto {

    private List<TransactionDetail> list;

    public AccountTransactionResponseDto() {}

    public AccountTransactionResponseDto(List<TransactionDetail> list) {
        this.list = list;
    }

    public List<TransactionDetail> getList() {
        return list;
    }

    public void setList(List<TransactionDetail> list) {
        this.list = list;
    }

    public static class TransactionDetail {
        private String transactionUniqueNo;
        private String transactionDate;
        private String transactionTime;
        private String transactionType;
        private String transactionAccountNo;
        private BigDecimal transactionBalance;
        private BigDecimal transactionAfterBalance;
        private String transactionSummary;
        private String transactionMemo;

        public TransactionDetail() {}

        public TransactionDetail(String transactionUniqueNo, String transactionDate, String transactionTime,
                                 String transactionType, String transactionTypeName, String transactionAccountNo,
                                 BigDecimal transactionBalance, BigDecimal transactionAfterBalance,
                                 String transactionSummary, String transactionMemo) {
            this.transactionUniqueNo = transactionUniqueNo;
            this.transactionDate = transactionDate;
            this.transactionTime = transactionTime;
            this.transactionType = transactionType;
            this.transactionAccountNo = transactionAccountNo;
            this.transactionBalance = transactionBalance;
            this.transactionAfterBalance = transactionAfterBalance;
            this.transactionSummary = transactionSummary;
            this.transactionMemo = transactionMemo;
        }

        // Getter 생략 없이 전부 구현
        public String getTransactionUniqueNo() { return transactionUniqueNo; }
        public String getTransactionDate() { return transactionDate; }
        public String getTransactionTime() { return transactionTime; }
        public String getTransactionType() { return transactionType; }
        public String getTransactionAccountNo() { return transactionAccountNo; }
        public BigDecimal getTransactionBalance() { return transactionBalance; }
        public BigDecimal getTransactionAfterBalance() { return transactionAfterBalance; }
        public String getTransactionSummary() { return transactionSummary; }
        public String getTransactionMemo() { return transactionMemo; }
    }
}
