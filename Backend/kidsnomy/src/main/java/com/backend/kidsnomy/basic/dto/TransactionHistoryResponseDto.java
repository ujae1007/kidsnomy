package com.backend.kidsnomy.basic.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class TransactionHistoryResponseDto {
    private String totalCount;
    private List<TransactionDto> list;

    @Data
    @Builder
    public static class TransactionDto {
        private String transactionUniqueNo;
        private String transactionDate;
        private String transactionTime;
        private String transactionType;
        private String transactionTypeName;
        private String transactionAccountNo;
        private BigDecimal transactionBalance;
        private BigDecimal transactionAfterBalance;
        private String transactionSummary;
        private String transactionMemo;
    }
}
