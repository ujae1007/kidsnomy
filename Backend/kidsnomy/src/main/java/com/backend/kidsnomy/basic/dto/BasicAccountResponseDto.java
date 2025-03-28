package com.backend.kidsnomy.basic.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class BasicAccountResponseDto {
    private String accountNo;
    private BigDecimal balance;
}
