package com.backend.kidsnomy.finance.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "savings")
public class Savings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "group_id", nullable = false)
    private Long groupId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(length = 50)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "interest_rate", precision = 5, scale = 2)
    private BigDecimal interestRate;

    @Column(name = "due_date")
    private Integer dueDate;

    @Column(name = "rate_date")
    private Integer rateDate;

    @Column(name = "pay_date")
    private Integer payDate;

    @Column(name = "product_type")
    private Byte productType = 1;

    public Savings() {}

    public Savings(Long groupId, Long userId, String title, String content,
                   BigDecimal interestRate, Integer dueDate,
                   Integer rateDate, Integer payDate) {
        this.groupId = groupId;
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.interestRate = interestRate;
        this.dueDate = dueDate;
        this.rateDate = rateDate;
        this.payDate = payDate;
        this.productType = 1;
    }

    public Long getId() {
        return id;
    }

    public Long getGroupId() {
        return groupId;
    }

    public Long getUserId() {
        return userId;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public BigDecimal getInterestRate() {
        return interestRate;
    }

    public Integer getDueDate() {
        return dueDate;
    }

    public Integer getRateDate() {
        return rateDate;
    }

    public Integer getPayDate() {
        return payDate;
    }

    public Byte getProductType() {
        return productType;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setInterestRate(BigDecimal interestRate) {
        this.interestRate = interestRate;
    }

    public void setDueDate(Integer dueDate) {
        this.dueDate = dueDate;
    }

    public void setRateDate(Integer rateDate) {
        this.rateDate = rateDate;
    }

    public void setPayDate(Integer payDate) {
        this.payDate = payDate;
    }

    public void setProductType(Byte productType) {
        this.productType = productType;
    }
}
