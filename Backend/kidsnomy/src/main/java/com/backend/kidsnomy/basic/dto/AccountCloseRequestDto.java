package com.backend.kidsnomy.basic.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AccountCloseRequestDto {
    @NotBlank(message = "계좌번호는 필수입니다")
    private String accountNo;
    private String refundAccountNo; // 잔액이 있는 경우 필수
}
