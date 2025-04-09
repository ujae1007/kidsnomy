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
    private Integer status;       // 0: 미계약, 1: 계약됨

    public FinanceProductResponseDto() {}

    public FinanceProductResponseDto(Long id, Long groupId, Long userId, String title, String content,
                                     BigDecimal interestRate, Integer dueDate, Integer rateDate,
                                     Integer payDate, Byte productType, Integer status) {
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
        this.status = status;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getGroupId() { return groupId; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public BigDecimal getInterestRate() { return interestRate; }
    public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }

    public Integer getDueDate() { return dueDate; }
    public void setDueDate(Integer dueDate) { this.dueDate = dueDate; }

    public Integer getRateDate() { return rateDate; }
    public void setRateDate(Integer rateDate) { this.rateDate = rateDate; }

    public Integer getPayDate() { return payDate; }
    public void setPayDate(Integer payDate) { this.payDate = payDate; }

    public Byte getProductType() { return productType; }
    public void setProductType(Byte productType) { this.productType = productType; }

    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
}
