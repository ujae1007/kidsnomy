package com.backend.kidsnomy.basic.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BasicProductResponseDto {
    private String accountTypeUniqueNo;
    private String accountName;
    private String accountDescription;
    private String bankCode;
}
