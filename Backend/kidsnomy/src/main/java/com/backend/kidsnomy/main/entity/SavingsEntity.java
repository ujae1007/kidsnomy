package com.backend.kidsnomy.main.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "savings")
public class SavingsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "group_id", nullable = false)
    private Long groupId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "title")
    private String title;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "interest_rate")
    private BigDecimal interestRate;

    @Column(name = "due_date")
    private Integer dueDate;

    @Column(name = "rate_date")
    private Integer rateDate;

    @Column(name = "pay_date")
    private Integer payDate;

    @Column(name = "product_type")
    private Integer productType;

    public SavingsEntity() {}

    public Long getId() { return id; }
    public Long getGroupId() { return groupId; }
    public Long getUserId() { return userId; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public BigDecimal getInterestRate() { return interestRate; }
    public Integer getDueDate() { return dueDate; }
    public Integer getRateDate() { return rateDate; }
    public Integer getPayDate() { return payDate; }
    public Integer getProductType() { return productType; }

    public void setGroupId(Long groupId) { this.groupId = groupId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setTitle(String title) { this.title = title; }
    public void setContent(String content) { this.content = content; }
    public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }
    public void setDueDate(Integer dueDate) { this.dueDate = dueDate; }
    public void setRateDate(Integer rateDate) { this.rateDate = rateDate; }
    public void setPayDate(Integer payDate) { this.payDate = payDate; }
    public void setProductType(Integer productType) { this.productType = productType; }
}
