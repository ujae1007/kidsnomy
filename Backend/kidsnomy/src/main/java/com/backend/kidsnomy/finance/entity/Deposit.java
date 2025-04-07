package com.backend.kidsnomy.finance.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;

@Entity
@Table(name = "deposit")
public class Deposit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "group_id", nullable = false)
    private Long groupId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "title", length = 50)
    private String title;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "interest_rate", precision = 5, scale = 2)
    private BigDecimal interestRate;

    @Column(name = "due_date")
    private Integer dueDate;

    @Column(name = "product_type")
    private Byte productType = 0; // 기본값 0

    public Deposit() {}

    // 생성자
    public Deposit(Long groupId, Long userId, String title, String content, BigDecimal interestRate, Integer dueDate) {
        this.groupId = groupId;
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.interestRate = interestRate;
        this.dueDate = dueDate;
        this.productType = 0;
    }

    // Getter / Setter
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

    public Byte getProductType() {
        return productType;
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

    public void setProductType(Byte productType) {
        this.productType = productType;
    }
}
