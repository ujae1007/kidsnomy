package com.backend.kidsnomy.work.repository;

import com.backend.kidsnomy.work.entity.Work;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkRepository extends JpaRepository<Work, Long> {
    // 일자리 생성은 save() 메서드만 사용하면 됨 (JpaRepository 기본 제공)
}
