package com.backend.kidsnomy.basic.dto;

import lombok.Data;
import java.util.List;

@Data
public class TransactionHistoryResponseDto {
    private String totalCount;
    private List<TransactionDto> list;

    @Data
    public static class TransactionDto {
        private String transactionUniqueNo;
        private String transactionDate;
        private String transactionTime;
        private String transactionType;
        private String transactionTypeName;
        private String transactionAccountNo;
        private String transactionBalance;
        private String transactionAfterBalance;
        private String transactionSummary;
        private String transactionMemo;
    }
}
