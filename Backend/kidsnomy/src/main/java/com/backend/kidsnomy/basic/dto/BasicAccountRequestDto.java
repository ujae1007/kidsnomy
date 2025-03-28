package com.backend.kidsnomy.basic.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
    @Size(min = 4, max = 4, message = "계좌 비밀번호는 4자리여야 합니다")
    private Integer accountPassword;
}
