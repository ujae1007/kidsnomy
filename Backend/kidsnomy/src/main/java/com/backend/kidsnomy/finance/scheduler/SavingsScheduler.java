package com.backend.kidsnomy.finance.scheduler;

import com.backend.kidsnomy.finance.service.savingshandler.SavingsRegularHandler;
import com.backend.kidsnomy.finance.service.savingshandler.SavingsInterestHandler;
import com.backend.kidsnomy.finance.service.savingshandler.SavingsMaturityHandler;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class SavingsScheduler {

    private final SavingsRegularHandler regularHandler;
    private final SavingsInterestHandler interestHandler;
    private final SavingsMaturityHandler maturityHandler;

    public SavingsScheduler(
            SavingsRegularHandler regularHandler,
            SavingsInterestHandler interestHandler,
            SavingsMaturityHandler maturityHandler) {
        this.regularHandler = regularHandler;
        this.interestHandler = interestHandler;
        this.maturityHandler = maturityHandler;
    }

    // 매일 00:00:01에 실행 (서머타임/표준시 자동 보정)
    @Scheduled(cron = "1 0 0 * * *", zone = "Asia/Seoul")
    @Transactional
    public void executeDailyTasks() {
        int todayDay = LocalDate.now().getDayOfMonth();

        // 2-1. 정기 납입
        regularHandler.processAllRegularSavings(todayDay);

        // 2-2. 이자 지급
        interestHandler.processAllInterestPayments(todayDay);

        // 2-3. 만기 계좌 처리
        maturityHandler.processAllMaturities();
    }

    // 매일 23:59:59에 최종 이자 지급
    @Scheduled(cron = "59 59 23 * * *", zone = "Asia/Seoul")
    public void processFinalInterest() {
        maturityHandler.processFinalDayInterest();
    }
}
