package com.backend.kidsnomy.basic.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class AccountCheckResponseDto {
    private String user_name;
    private String bankCode;
    private String accountNo;
    private BigDecimal accountBalance;
    private String accountCreatedDate;
    private String accountExpiryDate;
    private String lastTransactionDate;
    private String currency;
}
