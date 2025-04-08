package com.backend.kidsnomy.finance.dto;

import java.math.BigDecimal;

public class FinanceProductResponseDto {
    private Long id;
    private Long groupId;
    private Long userId;
    private String title;
    private String content;
    private BigDecimal interestRate;
    private Integer dueDate;
    private Integer rateDate;     // 적금 전용
    private Integer payDate;      // 적금 전용
    private Byte productType;     // 예금:0, 적금:1

    public FinanceProductResponseDto() {}

    public FinanceProductResponseDto(Long id, Long groupId, Long userId, String title, String content,
                                     BigDecimal interestRate, Integer dueDate, Integer rateDate,
                                     Integer payDate, Byte productType) {
        this.id = id;
        this.groupId = groupId;
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.interestRate = interestRate;
        this.dueDate = dueDate;
        this.rateDate = rateDate;
        this.payDate = payDate;
        this.productType = productType;
    }

    public Long getId() { return id; }
    public Long getGroupId() { return groupId; }
    public Long getUserId() { return userId; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public BigDecimal getInterestRate() { return interestRate; }
    public Integer getDueDate() { return dueDate; }
    public Integer getRateDate() { return rateDate; }
    public Integer getPayDate() { return payDate; }
    public Byte getProductType() { return productType; }

    public void setId(Long id) { this.id = id; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setTitle(String title) { this.title = title; }
    public void setContent(String content) { this.content = content; }
    public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }
    public void setDueDate(Integer dueDate) { this.dueDate = dueDate; }
    public void setRateDate(Integer rateDate) { this.rateDate = rateDate; }
    public void setPayDate(Integer payDate) { this.payDate = payDate; }
    public void setProductType(Byte productType) { this.productType = productType; }
}
