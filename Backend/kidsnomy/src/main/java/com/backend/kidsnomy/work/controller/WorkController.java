package com.backend.kidsnomy.work.controller;

import com.backend.kidsnomy.work.dto.ChildContractedWorkResponseDto;
import com.backend.kidsnomy.work.dto.ChildWorkListResponseDto;
import com.backend.kidsnomy.work.dto.ParentWorkListResponseDto;
import com.backend.kidsnomy.work.dto.WorkCreateRequestDto;
import com.backend.kidsnomy.work.dto.WorkDetailResponseDto;
import com.backend.kidsnomy.work.service.WorkService;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/work")
public class WorkController {

    private final WorkService workService;

    public WorkController(WorkService workService) {
        this.workService = workService;
    }

    // 1. (부모) 일자리 생성
    @PostMapping("/create")
    public ResponseEntity<String> createWork(@RequestBody WorkCreateRequestDto dto,
                                             HttpServletRequest request) {
        workService.createWork(dto, request);
        return ResponseEntity.ok("일자리가 성공적으로 생성되었습니다.");
    }
    
    // 2. (부모) 생성한 일자리 삭제
    @DeleteMapping("/delete/{jobId}")
    public ResponseEntity<String> deleteWork(@PathVariable("jobId") Long jobId, HttpServletRequest request) {
        workService.deleteWork(jobId, request);
        return ResponseEntity.ok("일자리가 삭제되었습니다.");
    }
    
    // 3. (부모) 그룹 내에서 본인이 생성한 일자리 조회
    @GetMapping("/parent/check/{groupId}")
    public ResponseEntity<List<ParentWorkListResponseDto>> getParentWorks(
            @PathVariable("groupId") Long groupId,
            HttpServletRequest request) {
        List<ParentWorkListResponseDto> works = workService.getParentWorkList(groupId, request);
        return ResponseEntity.ok(works);
    }

    // 4. (자녀) 그룹 내에서 계약되지 않은 일자리 조회
    @GetMapping("/child/check/{groupId}")
    public ResponseEntity<List<ChildWorkListResponseDto>> getUncontractedWorks(
            @PathVariable("groupId") Long groupId,
            HttpServletRequest request) {
        List<ChildWorkListResponseDto> works = workService.getUncontractedWorks(groupId, request);
        return ResponseEntity.ok(works);
    }
    
    // 5. (자녀) 일자리 계약
    @PutMapping("/child/contract/{jobId}")
    public ResponseEntity<String> contractWork(@PathVariable("jobId") Long jobId,
                                               HttpServletRequest request) {
        workService.contractWork(jobId, request);
        return ResponseEntity.ok("일자리가 성공적으로 계약되었습니다.");
    }
    
    // 6. (자녀) 본인이 계약한 일자리 조회
    @GetMapping("/child/contracted/{groupId}")
    public ResponseEntity<List<ChildContractedWorkResponseDto>> getContractedWorks(
            @PathVariable("groupId") Long groupId,
            HttpServletRequest request) {
        List<ChildContractedWorkResponseDto> result = workService.getContractedWorkList(groupId, request);
        return ResponseEntity.ok(result);
    }
    
    // 7. (공통) 일자리 정보 상세 조회
    @GetMapping("/check/detail/{jobId}")
    public ResponseEntity<WorkDetailResponseDto> getWorkDetail(
            @PathVariable("jobId") Long jobId,
            HttpServletRequest request) {
        WorkDetailResponseDto response = workService.getWorkDetail(jobId, request);
        return ResponseEntity.ok(response);
    }
    
    // 8. (자녀) 업무 수행 완료 요청
    @PutMapping("/child/complete/{jobId}")
    public ResponseEntity<String> requestJobCompletion(@PathVariable("jobId") Long jobId,
                                                       HttpServletRequest request) {
        workService.requestJobCompletion(jobId, request);
        return ResponseEntity.ok("일자리 완료 요청이 정상적으로 처리되었습니다.");
    }
    
    // 9. (부모) 업무 수행 완료 승인
    @PostMapping("/parent/complete/{jobId}")
    public ResponseEntity<String> completeJobByParent(@PathVariable("jobId") Long jobId,
                                                      HttpServletRequest request) {
        workService.completeJobByParent(jobId, request);
        return ResponseEntity.ok("일자리가 최종 완료 처리되었습니다.");
    }
    
    // 10. (자녀) 그룹 내 모든 일자리 조회
    @GetMapping("/child/allcheck/{groupId}")
    public ResponseEntity<List<ChildWorkListResponseDto>> getAllWorksByChild(
            @PathVariable("groupId") Long groupId,
            HttpServletRequest request
    ) {
        List<ChildWorkListResponseDto> works = workService.getAllWorks(groupId, request);
        return ResponseEntity.ok(works);
    }

}
