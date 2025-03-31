package com.backend.kidsnomy.basic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionHistoryResponseDto {

    private String totalCount;
    private List<TransactionDto> list;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
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
