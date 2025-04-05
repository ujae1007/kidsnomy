package com.backend.kidsnomy.main.repository;

import com.backend.kidsnomy.main.entity.JobEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepositoryMain extends JpaRepository<JobEntity, Long> {

    // 아이가 계약한 일자리 (employeeId 기준)
    List<JobEntity> findByEmployeeIdAndGroupId(Long employeeId, Long groupId);

    // 부모가 만든 일자리 (employerId 기준)
    List<JobEntity> findByEmployerIdAndGroupId(Long employerId, Long groupId);
}
