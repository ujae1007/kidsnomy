package com.backend.kidsnomy.work.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.backend.kidsnomy.work.entity.Work;
import com.backend.kidsnomy.work.repository.WorkRepository;

import java.time.LocalDate;
import java.util.List;

@Component
public class WorkScheduler {

    private final WorkRepository workRepository;

    public WorkScheduler(WorkRepository workRepository) {
        this.workRepository = workRepository;
    }

    @Scheduled(cron = "1 0 0 * * *", zone = "Asia/Seoul") // 매일 00:00:01 (서울 기준)
    @Transactional
    public void processWorkStatus() {
        LocalDate today = LocalDate.now();
        List<Work> allWorks = workRepository.findAll();

        for (Work work : allWorks) {
            boolean isPermanent = Boolean.TRUE.equals(work.getIsPermanent());
            LocalDate endAtDate = work.getEndAt().toLocalDate();

            if (!isPermanent) {
                // 상시 아님: endAt이 오늘보다 전이면 삭제
                if (endAtDate.isBefore(today)) {
                    workRepository.delete(work);
                }
                // 그렇지 않으면 아무것도 안 함
            } else {
                // 상시인 경우
                if (endAtDate.isBefore(today)) {
                    // 상시인데 endAt 지났으면 삭제
                    workRepository.delete(work);
                } else {
                    // 기간 안 지났으면 초기화
                    work.setEmployeeId(null);
                    work.setStatus(1);
                    workRepository.save(work);
                }
            }
        }
    }
}
