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

    @Column(name = "account_no", nullable = false)
    private String accountNo;

    @Column(name = "transaction_name")
    private String transactionName;

    @Column(name = "transaction_unique_no", nullable = false, unique = true)
    private String transactionUniqueNo;

    @Column(name = "transaction_date")
    private LocalDateTime transactionDate;

    @Column(name = "transaction_time")
    private LocalDateTime transactionTime;

    @Column(name = "transaction_type")
    private Integer transactionType;

    @Column(name = "transaction_balance")
    private BigDecimal transactionBalance;

    @Column(name = "transaction_after_balance")
    private BigDecimal transactionAfterBalance;

    @Column(name = "transaction_summary")
    private String transactionSummary;

    @Column(name = "transaction_memo")
    private String transactionMemo;
}
