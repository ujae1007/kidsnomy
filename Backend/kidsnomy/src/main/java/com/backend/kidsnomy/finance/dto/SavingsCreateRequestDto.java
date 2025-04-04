package com.backend.kidsnomy.finance.dto;

import java.math.BigDecimal;

public class SavingsCreateRequestDto {

    private Long groupId;
    private String title;
    private String content;
    private BigDecimal interestRate;
    private Integer dueDate;
    private Integer rateDate;
    private Integer payDate;

    public SavingsCreateRequestDto() {}

    public SavingsCreateRequestDto(Long groupId, String title, String content,
                                   BigDecimal interestRate, Integer dueDate,
                                   Integer rateDate, Integer payDate) {
        this.groupId = groupId;
        this.title = title;
        this.content = content;
        this.interestRate = interestRate;
        this.dueDate = dueDate;
        this.rateDate = rateDate;
        this.payDate = payDate;
    }

    public Long getGroupId() { return groupId; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public BigDecimal getInterestRate() { return interestRate; }
    public Integer getDueDate() { return dueDate; }
    public Integer getRateDate() { return rateDate; }
    public Integer getPayDate() { return payDate; }

    public void setGroupId(Long groupId) { this.groupId = groupId; }
    public void setTitle(String title) { this.title = title; }
    public void setContent(String content) { this.content = content; }
    public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }
    public void setDueDate(Integer dueDate) { this.dueDate = dueDate; }
    public void setRateDate(Integer rateDate) { this.rateDate = rateDate; }
    public void setPayDate(Integer payDate) { this.payDate = payDate; }
}
