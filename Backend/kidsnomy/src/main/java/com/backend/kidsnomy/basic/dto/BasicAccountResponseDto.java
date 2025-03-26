package com.backend.kidsnomy.basic.dto;

import lombok.Data;

@Data
public class BasicAccountResponseDto {
    private String accountNo;
    private String accountBalance;
    private String accountCreatedDate;
    private String lastTransactionDate;
}
