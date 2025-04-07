package com.backend.kidsnomy.main.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "savings_contract")
public class SavingsContractEntity {

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

    @Column(name = "account_no")
    private String accountNo;

    @Column(name = "balance")
    private BigDecimal balance;

    @Column(name = "one_time_volume")
    private BigDecimal oneTimeVolume;

    @Column(name = "rate_volume")
    private BigDecimal rateVolume;

    public SavingsContractEntity() {}

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

    public void setGroupId(Long groupId) { this.groupId = groupId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public void setStartDay(LocalDateTime startDay) { this.startDay = startDay; }
    public void setEndDay(LocalDateTime endDay) { this.endDay = endDay; }
    public void setAccountNo(String accountNo) { this.accountNo = accountNo; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public void setOneTimeVolume(BigDecimal oneTimeVolume) { this.oneTimeVolume = oneTimeVolume; }
    public void setRateVolume(BigDecimal rateVolume) { this.rateVolume = rateVolume; }
}
