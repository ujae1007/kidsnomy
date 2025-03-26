package com.backend.kidsnomy.basic.dto;

import lombok.Data;

@Data
public class BasicProductRequestDto {
    private String accountName;
    private String accountDescription;
    private String bankCode;
}