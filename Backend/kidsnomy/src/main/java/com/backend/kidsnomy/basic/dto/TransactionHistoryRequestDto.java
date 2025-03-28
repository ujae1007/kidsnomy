package com.backend.kidsnomy.basic.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class TransactionHistoryRequestDto {
    @NotBlank(message = "계좌번호는 필수입니다")
    private String accountNo;

    // 단건 조회 시 필요한 필드
    private String transactionUniqueNo;

    // 전체 목록 조회 시 필요한 필드들 (프론트에서 필터링해서 쓸 것)
    private String startDate;
    private String endDate;
    private String transactionType;
    private String orderByType;
}
