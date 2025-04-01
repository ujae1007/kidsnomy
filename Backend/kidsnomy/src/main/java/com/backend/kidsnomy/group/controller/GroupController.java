package com.backend.kidsnomy.group.controller;

import com.backend.kidsnomy.group.dto.GroupCreateResponseDto;
import com.backend.kidsnomy.group.dto.GroupListResponseDto;
import com.backend.kidsnomy.group.dto.GroupParticipationRequestDto;
import com.backend.kidsnomy.group.service.GroupService;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/group")
public class GroupController {

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    // 1. 그룹 생성
    @PostMapping("/create")
    public ResponseEntity<GroupCreateResponseDto> createGroup(HttpServletRequest request) {
        String groupCode = groupService.createGroup(request);
        GroupCreateResponseDto responseDto = new GroupCreateResponseDto(groupCode);
        return ResponseEntity.ok(responseDto);
    }
    
    // 2. 그룹 참가
    @PostMapping("/participation")
    public ResponseEntity<String> participateGroup(
            @RequestBody GroupParticipationRequestDto dto,
            HttpServletRequest request) {

        groupService.participateGroup(dto, request);
        return ResponseEntity.ok("그룹 참여가 완료되었습니다.");
    }
    
    // 3. 그룹 탈퇴
    
    // 4. 내가 가입한 그룹 목록 조회
    @GetMapping("/check")
    public ResponseEntity<List<GroupListResponseDto>> getMyGroups(HttpServletRequest request) {
        List<GroupListResponseDto> result = groupService.getMyGroups(request);
        return ResponseEntity.ok(result);
    }

}
