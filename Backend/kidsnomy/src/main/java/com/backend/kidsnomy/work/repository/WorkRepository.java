package com.backend.kidsnomy.work.repository;

import com.backend.kidsnomy.work.entity.Work;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkRepository extends JpaRepository<Work, Long> {
    // 일자리 생성은 save() 메서드만 사용하면 됨 (JpaRepository 기본 제공)
	
	// (부모) 그룹내에서 본인이 생성한 일자리 조회
	List<Work> findAllByGroupIdAndEmployerId(Long groupId, Long employerId);
	
    // 자녀가 아직 계약하지 않은 일자리 (employeeId == null 인 값들만)
    List<Work> findAllByGroupIdAndEmployeeIdIsNull(Long groupId);
    
    // 자녀가 계약한 일자리만 조회를 위해
    List<Work> findAllByGroupIdAndEmployeeId(Long groupId, Long employeeId);
    
    // 스케쥴러 처리를 위함
    List<Work> findAllByEndAtAfter(LocalDateTime now);

    // 스케쥴러 처리를 위함
    List<Work> findAllByEndAtBefore(LocalDateTime now);
    
    // 그룹 내 모든 일자리 조회를 위함
    List<Work> findAllByGroupId(Long groupId);
}
