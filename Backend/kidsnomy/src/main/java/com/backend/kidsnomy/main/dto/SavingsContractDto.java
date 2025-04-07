package com.backend.kidsnomy.main.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SavingsContractDto {
    private Long id;
    private Long groupId;
    private Long userId;
    private Long productId;
    private LocalDateTime startDay;
    private LocalDateTime endDay;
    private String accountNo;
    private BigDecimal balance;
    private BigDecimal oneTimeVolume;
    private BigDecimal rateVolume;

    public SavingsContractDto() {}
    
    public SavingsContractDto(Long id, Long groupId, Long userId, Long productId,
            LocalDateTime startDay, LocalDateTime endDay,
            String accountNo, BigDecimal balance,
            BigDecimal oneTimeVolume, BigDecimal rateVolume) {
			this.id = id;
			this.groupId = groupId;
			this.userId = userId;
			this.productId = productId;
			this.startDay = startDay;
			this.endDay = endDay;
			this.accountNo = accountNo;
			this.balance = balance;
			this.oneTimeVolume = oneTimeVolume;
			this.rateVolume = rateVolume;
	}

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
}
