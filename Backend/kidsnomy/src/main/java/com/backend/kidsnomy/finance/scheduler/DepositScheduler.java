package com.backend.kidsnomy.finance.scheduler;

import com.backend.kidsnomy.finance.service.deposithandler.DepositMaturityHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
public class DepositScheduler {
    private final DepositMaturityHandler maturityHandler;

    public DepositScheduler(DepositMaturityHandler maturityHandler) {
        this.maturityHandler = maturityHandler;
    }

    @Scheduled(cron = "1 0 0 * * *", zone = "Asia/Seoul")
    public void executeDailyTasks() {
        maturityHandler.processAllMaturities();
    }

    // 매일 23:59:59에 최종 이자 지급
    @Scheduled(cron = "59 59 23 * * *", zone = "Asia/Seoul")
    public void processFinalInterest() {
        maturityHandler.processFinalDayInterest();
    }
}
