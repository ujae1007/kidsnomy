package com.backend.kidsnomy.basic.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

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

    @Column(nullable = false)
    private String accountNo;

    @Column(name = "transaction_name")
    private String transactionName;

    @Column(name = "transactionUniqueNo", nullable = false, unique = true)
    private String transactionUniqueNo;

    @Column(name = "transactionDate")
    private LocalDateTime transactionDate;

    @Column(name = "transactionTime")
    private LocalDateTime transactionTime;

    @Column(name = "transactionType")
    private Integer transactionType;

    @Column(name = "transactionBalance")
    private BigDecimal transactionBalance;

    @Column(name = "transactionAfterBalance")
    private BigDecimal transactionAfterBalance;
}
