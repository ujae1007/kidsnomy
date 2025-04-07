package com.backend.kidsnomy.group.repository;

import com.backend.kidsnomy.group.entity.GroupMembership;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupMembershipRepository extends JpaRepository<GroupMembership, Long> {

    // 그룹 ID + 사용자 ID로 가입 여부 확인
    boolean existsByGroupIdAndUserId(Long groupId, Long userId);

    // 그룹 ID로 그룹 인원 수 조회
    long countByGroupId(Long groupId);

    // 그룹 내 특정 사용자의 멤버십 삭제
    void deleteByGroupIdAndUserId(Long groupId, Long userId);
    
	// 해당 그룹에 내가 속해있는지 판단
	boolean existsByUserIdAndGroupId(Long userId, Long groupId);
	
	// 내가 가입한 그룹 목록 조회
	List<GroupMembership> findByUserId(Long userId); // 단일 결과 반환

    // 다중 조회 (사용자가 여러 그룹에 속할 수 있는 경우)
    List<GroupMembership> findAllByUserId(Long userId);

    // 그룹 내 모든 멤버 조회
    List<GroupMembership> findByGroupId(Long groupId);
}
