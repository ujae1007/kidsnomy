package com.backend.kidsnomy.basic.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "basic_product")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BasicProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String accountTypeUniqueNo;
}
