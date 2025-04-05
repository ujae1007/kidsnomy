package com.backend.kidsnomy.common.enums;

public enum TransferType {
    DEPOSIT_INITIAL,     // 예금 초기이체
    DEPOSIT_INTEREST,    // 예금 이자지급
    DEPOSIT_MATURITY,    // 예금 만기
    SAVINGS_RECURRING,   // 적금 정기이체
    SAVINGS_INTEREST,    // 적금 이자지급
    SAVINGS_MATURITY     // 적금 만기
}
