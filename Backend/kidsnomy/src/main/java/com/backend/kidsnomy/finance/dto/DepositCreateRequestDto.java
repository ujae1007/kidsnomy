package com.backend.kidsnomy.finance.dto;

import java.math.BigDecimal;

public class DepositCreateRequestDto {

    private Long groupId;
    private String title;
    private String content;
    private BigDecimal interestRate;
    private Integer dueDate;

    public DepositCreateRequestDto() {}

    public DepositCreateRequestDto(Long groupId, String title, String content, BigDecimal interestRate, Integer dueDate) {
        this.groupId = groupId;
        this.title = title;
        this.content = content;
        this.interestRate = interestRate;
        this.dueDate = dueDate;
    }

    public Long getGroupId() { return groupId; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public BigDecimal getInterestRate() { return interestRate; }
    public Integer getDueDate() { return dueDate; }

    public void setGroupId(Long groupId) { this.groupId = groupId; }
    public void setTitle(String title) { this.title = title; }
    public void setContent(String content) { this.content = content; }
    public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }
    public void setDueDate(Integer dueDate) { this.dueDate = dueDate; }
}
