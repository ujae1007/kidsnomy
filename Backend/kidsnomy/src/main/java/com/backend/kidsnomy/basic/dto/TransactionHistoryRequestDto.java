package com.backend.kidsnomy.basic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionHistoryRequestDto {

    @NotBlank(message = "계좌번호는 필수입니다")
    private String accountNo;

    @NotBlank(message = "조회 시작일자는 필수입니다")
    @Pattern(regexp = "^\\d{8}$", message = "조회 시작일자는 YYYYMMDD 형식이어야 합니다")
    private String startDate;

    @NotBlank(message = "조회 종료일자는 필수입니다")
    @Pattern(regexp = "^\\d{8}$", message = "조회 종료일자는 YYYYMMDD 형식이어야 합니다")
    private String endDate;

    @NotBlank(message = "거래구분은 필수입니다")
    @Pattern(regexp = "^[MDA]$", message = "거래구분은 M(입금), D(출금), A(전체) 중 하나여야 합니다")
    private String transactionType;

    @Builder.Default
    private String orderByType = "DESC"; // 기본값은 최근 거래 순
}
