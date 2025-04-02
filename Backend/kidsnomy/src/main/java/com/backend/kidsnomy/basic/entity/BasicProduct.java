package com.backend.kidsnomy.basic.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "basic_product")
public class BasicProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "account_type_unique_no", nullable = false)
    private String accountTypeUniqueNo;

    // 기본 생성자
    public BasicProduct() {}

    // 전체 필드 생성자
    public BasicProduct(Integer id, String accountTypeUniqueNo) {
        this.id = id;
        this.accountTypeUniqueNo = accountTypeUniqueNo;
    }

    // Getter / Setter
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getAccountTypeUniqueNo() {
        return accountTypeUniqueNo;
    }

    public void setAccountTypeUniqueNo(String accountTypeUniqueNo) {
        this.accountTypeUniqueNo = accountTypeUniqueNo;
    }
}
