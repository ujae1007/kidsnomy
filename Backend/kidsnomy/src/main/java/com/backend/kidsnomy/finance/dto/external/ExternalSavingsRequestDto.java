package com.backend.kidsnomy.finance.dto.external;

import java.util.Map;

public class ExternalSavingsRequestDto {

    private Map<String, Object> Header;  // API 요청 헤더
    private String accountTypeUniqueNo;  // 상품 고유번호

    public ExternalSavingsRequestDto(Map<String, Object> header, String accountTypeUniqueNo) {
        this.Header = header;
        this.accountTypeUniqueNo = accountTypeUniqueNo;
    }

    public Map<String, Object> getHeader() { return Header; }
    public String getAccountTypeUniqueNo() { return accountTypeUniqueNo; }

    public void setHeader(Map<String, Object> header) { Header = header; }
    public void setAccountTypeUniqueNo(String accountTypeUniqueNo) { this.accountTypeUniqueNo = accountTypeUniqueNo; }
}