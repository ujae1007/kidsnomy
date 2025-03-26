package com.backend.kidsnomy.basic.dto;

import lombok.Data;
import java.util.List;

@Data
public class TransactionHistoryRequestDto {
    private String accountNo;
    private String startDate;
    private String endDate;
    private String transactionType;
    private String orderByType;
}
