package com.backend.kidsnomy.basic.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class AccountCloseResponseDto {
    private String status;
    private String accountNo;
    private String refundAccountNo;
    private BigDecimal accountBalance;
}
