package com.backend.kidsnomy.finance.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class FinanceContractResponseDto {
    private Long contractId;
    private Long groupId;
    private Long userId;
    private Long productId;
    private String accountNo;
    private LocalDateTime startDay;
    private LocalDateTime endDay;
    private BigDecimal balance;
    private BigDecimal totalVolume;       // 예금 전용
    private BigDecimal oneTimeVolume;     // 적금 전용
    private BigDecimal rateVolume;        // 적금 전용
    private Integer status;
    private Byte productType;             // 예금:0, 적금:1
    private String productTitle;

    public FinanceContractResponseDto() {}

    public FinanceContractResponseDto(Long contractId, Long groupId, Long userId, Long productId, String accountNo,
                                      LocalDateTime startDay, LocalDateTime endDay, BigDecimal balance,
                                      BigDecimal totalVolume, BigDecimal oneTimeVolume, BigDecimal rateVolume,
                                      Integer status, Byte productType, String productTitle) {
        this.contractId = contractId;
        this.groupId = groupId;
        this.userId = userId;
        this.productId = productId;
        this.accountNo = accountNo;
        this.startDay = startDay;
        this.endDay = endDay;
        this.balance = balance;
        this.totalVolume = totalVolume;
        this.oneTimeVolume = oneTimeVolume;
        this.rateVolume = rateVolume;
        this.status = status;
        this.productType = productType;
        this.productTitle = productTitle;
    }

    public Long getContractId() { return contractId; }
    public Long getGroupId() { return groupId; }
    public Long getUserId() { return userId; }
    public Long getProductId() { return productId; }
    public String getAccountNo() { return accountNo; }
    public LocalDateTime getStartDay() { return startDay; }
    public LocalDateTime getEndDay() { return endDay; }
    public BigDecimal getBalance() { return balance; }
    public BigDecimal getTotalVolume() { return totalVolume; }
    public BigDecimal getOneTimeVolume() { return oneTimeVolume; }
    public BigDecimal getRateVolume() { return rateVolume; }
    public Integer getStatus() { return status; }
    public Byte getProductType() { return productType; }
    public String getProductTitle() { return productTitle; }

    public void setContractId(Long contractId) { this.contractId = contractId; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public void setAccountNo(String accountNo) { this.accountNo = accountNo; }
    public void setStartDay(LocalDateTime startDay) { this.startDay = startDay; }
    public void setEndDay(LocalDateTime endDay) { this.endDay = endDay; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public void setTotalVolume(BigDecimal totalVolume) { this.totalVolume = totalVolume; }
    public void setOneTimeVolume(BigDecimal oneTimeVolume) { this.oneTimeVolume = oneTimeVolume; }
    public void setRateVolume(BigDecimal rateVolume) { this.rateVolume = rateVolume; }
    public void setStatus(Integer status) { this.status = status; }
    public void setProductType(Byte productType) { this.productType = productType; }
    public void setProductTitle(String productTitle) { this.productTitle = productTitle; }
}
