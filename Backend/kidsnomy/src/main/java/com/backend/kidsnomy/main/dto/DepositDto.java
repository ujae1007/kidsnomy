package com.backend.kidsnomy.main.dto;

import java.math.BigDecimal;

public class DepositDto {
    private Long id;
    private Long groupId;
    private Long userId;
    private String title;
    private String content;
    private BigDecimal interestRate;
    private Integer dueDate;
    private Integer productType;

    public DepositDto() {}
    
    public DepositDto(Long id, Long groupId, Long userId, String title, String content,
            BigDecimal interestRate, Integer dueDate, Integer productType) {
			this.id = id;
			this.groupId = groupId;
			this.userId = userId;
			this.title = title;
			this.content = content;
			this.interestRate = interestRate;
			this.dueDate = dueDate;
			this.productType = productType;
    }

    public Long getId() { return id; }
    public Long getGroupId() { return groupId; }
    public Long getUserId() { return userId; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public BigDecimal getInterestRate() { return interestRate; }
    public Integer getDueDate() { return dueDate; }
    public Integer getProductType() { return productType; }

    public void setId(Long id) { this.id = id; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setTitle(String title) { this.title = title; }
    public void setContent(String content) { this.content = content; }
    public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }
    public void setDueDate(Integer dueDate) { this.dueDate = dueDate; }
    public void setProductType(Integer productType) { this.productType = productType; }
}
