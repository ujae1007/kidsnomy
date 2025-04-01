package com.backend.kidsnomy.basic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class BasicProductRequestDto {

    @NotBlank(message = "상품명은 필수입니다")
    private String accountName;

    private String accountDescription;

    @NotBlank(message = "은행코드는 필수입니다")
    @Size(min = 3, max = 3, message = "은행코드는 3자리여야 합니다")
    private String bankCode;

    // 기본 생성자
    public BasicProductRequestDto() {}

    // 전체 필드 생성자
    public BasicProductRequestDto(String accountName, String accountDescription, String bankCode) {
        this.accountName = accountName;
        this.accountDescription = accountDescription;
        this.bankCode = bankCode;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getAccountDescription() {
        return accountDescription;
    }

    public void setAccountDescription(String accountDescription) {
        this.accountDescription = accountDescription;
    }

    public String getBankCode() {
        return bankCode;
    }

    public void setBankCode(String bankCode) {
        this.bankCode = bankCode;
    }
}
