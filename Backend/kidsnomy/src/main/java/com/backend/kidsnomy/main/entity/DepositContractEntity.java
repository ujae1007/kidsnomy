package com.backend.kidsnomy.main.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "deposit_contract")
public class DepositContractEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "group_id")
    private Long groupId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "start_day")
    private LocalDateTime startDay;

    @Column(name = "end_day")
    private LocalDateTime endDay;

    @Column(name = "account_no")
    private String accountNo;

    @Column(name = "balancedeposit")
    private BigDecimal balance;

    @Column(name = "total_volume")
    private BigDecimal totalVolume;

    public DepositContractEntity() {}

    public Long getId() { return id; }
    public Long getGroupId() { return groupId; }
    public Long getUserId() { return userId; }
    public Long getProductId() { return productId; }
    public LocalDateTime getStartDay() { return startDay; }
    public LocalDateTime getEndDay() { return endDay; }
    public String getAccountNo() { return accountNo; }
    public BigDecimal getBalance() { return balance; }
    public BigDecimal getTotalVolume() { return totalVolume; }

    public void setGroupId(Long groupId) { this.groupId = groupId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public void setStartDay(LocalDateTime startDay) { this.startDay = startDay; }
    public void setEndDay(LocalDateTime endDay) { this.endDay = endDay; }
    public void setAccountNo(String accountNo) { this.accountNo = accountNo; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public void setTotalVolume(BigDecimal totalVolume) { this.totalVolume = totalVolume; }
}
