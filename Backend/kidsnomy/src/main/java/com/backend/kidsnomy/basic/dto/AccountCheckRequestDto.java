package com.backend.kidsnomy.basic.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AccountCheckRequestDto {
    @NotBlank(message = "계좌번호는 필수입니다")
    private String accountNo;
}
