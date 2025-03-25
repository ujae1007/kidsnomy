package com.backend.kidsnomy.group.repository;

import com.backend.kidsnomy.group.entity.GroupInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupInfoRepository extends JpaRepository<GroupInfo, Long> {
    boolean existsByGroupCode(String groupCode);
    GroupInfo findByGroupCode(String groupCode);
}
