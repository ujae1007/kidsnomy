package com.backend.kidsnomy.finance.entity;

import com.backend.kidsnomy.basic.entity.BasicProduct;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "deposit_contract")
public class DepositContract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "group_id", nullable = false)
    private Long groupId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

//    @Column(name = "product_id", nullable = false)
//    private Long productId;

    @Column(name = "start_day")
    private LocalDateTime startDay;

    @Column(name = "end_day")
    private LocalDateTime endDay;

    @Column(name = "account_no", nullable = false, unique = true)
    private String accountNo;

    @Column(name = "balancedeposit", precision = 15, scale = 2)
    private BigDecimal balance; // 초기 납입 금액 (초기 잔고)

    @Column(name = "total_volume", precision = 15, scale = 2)
    private BigDecimal totalVolume; // 이자 포함 총액 (만기 시점 금액)

    @Column(name = "status", columnDefinition = "TINYINT DEFAULT 0 COMMENT '0: 활성, 1: 해지'")
    private Integer status;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Deposit deposit;

    public DepositContract() {}

    // Getters
    public Long getId() { return id; }
    public Long getGroupId() { return groupId; }
    public Long getUserId() { return userId; }
    public LocalDateTime getStartDay() { return startDay; }
    public LocalDateTime getEndDay() { return endDay; }
    public String getAccountNo() { return accountNo; }
    public BigDecimal getBalance() { return balance; }
    public BigDecimal getTotalVolume() { return totalVolume; }
    public Integer getStatus() { return status; }
    public Deposit getDeposit() { return deposit; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setStartDay(LocalDateTime startDay) { this.startDay = startDay; }
    public void setEndDay(LocalDateTime endDay) { this.endDay = endDay; }
    public void setAccountNo(String accountNo) { this.accountNo = accountNo; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public void setTotalVolume(BigDecimal totalVolume) { this.totalVolume = totalVolume; }
    public void setStatus(Integer status) { this.status = status; }
    public void setDeposit(Deposit deposit) { this.deposit = deposit; }
}