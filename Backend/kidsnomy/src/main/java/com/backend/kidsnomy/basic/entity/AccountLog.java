package com.backend.kidsnomy.basic.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "account_log")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "account_no", nullable = false, length = 50)
    private String accountNo;

    @Column(name = "transaction_account_no", length = 70)
    private String transactionAccountNo;

    @Column(name = "transaction_unique_no", length = 50, unique = true)
    private String transactionUniqueNo;

    @Column(name = "transaction_date")
    private LocalDateTime transactionDate;

    @Column(name = "transaction_time")
    private LocalDateTime transactionTime;

    @Column(name = "transaction_type")
    private Integer transactionType;

    @Column(name = "transaction_balance", precision = 15, scale = 2)
    private BigDecimal transactionBalance;

    @Column(name = "transaction_after_balance", precision = 15, scale = 2)
    private BigDecimal transactionAfterBalance;

    @Column(name = "transaction_summary", length = 255)
    private String transactionSummary;

    @Column(name = "transaction_memo", length = 255)
    private String transactionMemo;
<<<<<<< Updated upstream
=======

    public AccountLog() {}

    // getter & setter 전부 생성

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getAccountNo() { return accountNo; }
    public void setAccountNo(String accountNo) { this.accountNo = accountNo; }

    public String getTransactionName() { return transactionAccountNo; }
    public void setTransactionName(String transactionName) { this.transactionAccountNo = transactionName; }

    public String getTransactionUniqueNo() { return transactionUniqueNo; }
    public void setTransactionUniqueNo(String transactionUniqueNo) { this.transactionUniqueNo = transactionUniqueNo; }

    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }

    public LocalDateTime getTransactionTime() { return transactionTime; }
    public void setTransactionTime(LocalDateTime transactionTime) { this.transactionTime = transactionTime; }

    public Integer getTransactionType() { return transactionType; }
    public void setTransactionType(Integer transactionType) { this.transactionType = transactionType; }

    public BigDecimal getTransactionBalance() { return transactionBalance; }
    public void setTransactionBalance(BigDecimal transactionBalance) { this.transactionBalance = transactionBalance; }

    public BigDecimal getTransactionAfterBalance() { return transactionAfterBalance; }
    public void setTransactionAfterBalance(BigDecimal transactionAfterBalance) { this.transactionAfterBalance = transactionAfterBalance; }

    public String getTransactionSummary() { return transactionSummary; }
    public void setTransactionSummary(String transactionSummary) { this.transactionSummary = transactionSummary; }

    public String getTransactionMemo() { return transactionMemo; }
    public void setTransactionMemo(String transactionMemo) { this.transactionMemo = transactionMemo; }
>>>>>>> Stashed changes
}
