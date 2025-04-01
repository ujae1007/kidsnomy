package com.backend.kidsnomy.basic.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BasicAccountRequestDto {
    @NotNull(message = "사용자 ID는 필수입니다")
    private Integer userId;

    @NotNull(message = "상품 고유번호는 필수입니다")
    private String accountTypeUniqueNo;

    @NotNull(message = "계좌 비밀번호는 필수입니다")
    @Min(value = 1000, message = "계좌 비밀번호는 4자리여야 합니다")
    @Max(value = 9999, message = "계좌 비밀번호는 4자리여야 합니다")
    private Integer accountPassword;
}
