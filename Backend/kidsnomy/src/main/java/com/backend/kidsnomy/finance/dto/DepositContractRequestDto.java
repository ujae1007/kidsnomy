package com.backend.kidsnomy.finance.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class DepositContractRequestDto {
    @NotNull(message = "예금 금액은 필수입니다.")
    @DecimalMin(value = "10000", message = "최소 10,000원 이상 입력해야 합니다.")
    private BigDecimal balance; // 예금 금액

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
}
