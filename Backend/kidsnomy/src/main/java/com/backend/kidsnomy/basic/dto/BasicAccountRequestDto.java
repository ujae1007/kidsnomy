package com.backend.kidsnomy.basic.dto;

import lombok.Data;

@Data
public class BasicAccountRequestDto {
    private Long userId;
    private String accountTypeUniqueNo;
    private Integer accountPassword;
}
