package com.backend.kidsnomy.finance.entity;

import com.backend.kidsnomy.basic.entity.BasicProduct;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "savings_contract")
public class SavingsContract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "group_id", nullable = false)
    private Long groupId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "start_day")
    private LocalDateTime startDay;

    @Column(name = "end_day")
    private LocalDateTime endDay;

    @Column(name = "account_no", nullable = false, unique = true)
    private String accountNo;

    @Column(precision = 15, scale = 2)
    private BigDecimal balance; // 잔고

    @Column(name = "one_time_volume", precision = 15, scale = 2)
    private BigDecimal oneTimeVolume; // 정기 납입액

    @Column(name = "rate_volume", precision = 15, scale = 2)
    private BigDecimal rateVolume; // 이자 금액 (이자 지급 시마다 갱신)

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false, insertable = false, updatable = false)
    private Savings savings;

    public SavingsContract() {}

    // Getters
    public Long getId() { return id; }
    public Long getGroupId() { return groupId; }
    public Long getUserId() { return userId; }
    public Long getProductId() { return productId; }
    public LocalDateTime getStartDay() { return startDay; }
    public LocalDateTime getEndDay() { return endDay; }
    public String getAccountNo() { return accountNo; }
    public BigDecimal getBalance() { return balance; }
    public BigDecimal getOneTimeVolume() { return oneTimeVolume; }
    public BigDecimal getRateVolume() { return rateVolume; }
    public Savings getSavings() { return savings; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public void setStartDay(LocalDateTime startDay) { this.startDay = startDay; }
    public void setEndDay(LocalDateTime endDay) { this.endDay = endDay; }
    public void setAccountNo(String accountNo) { this.accountNo = accountNo; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public void setOneTimeVolume(BigDecimal oneTimeVolume) { this.oneTimeVolume = oneTimeVolume; }
    public void setRateVolume(BigDecimal rateVolume) { this.rateVolume = rateVolume; }
    public void setSavings(Savings savings) { this.savings = savings; }
}