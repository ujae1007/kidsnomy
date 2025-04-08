package com.backend.kidsnomy.finance.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class SavingsContractRequestDto {

    @NotNull(message = "적금 납입 금액은 필수입니다.")
    @DecimalMin(value = "1000", message = "최소 1,000원 이상 입력해야 합니다.")
    private BigDecimal oneTimeVolume; // 적금 납입 금액

    public BigDecimal getOneTimeVolume() { return oneTimeVolume; }

    public void setOneTimeVolume(BigDecimal oneTimeVolume) { this.oneTimeVolume = oneTimeVolume; }
}




