package com.backend.kidsnomy.basic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BasicProductRequestDto {
    @NotBlank(message = "상품명은 필수입니다")
    private String accountName;

    private String accountDescription;

    @NotBlank(message = "은행코드는 필수입니다")
    @Size(min = 3, max = 3, message = "은행코드는 3자리여야 합니다")
    private String bankCode;
}
