package com.backend.kidsnomy.work.controller;

import com.backend.kidsnomy.work.dto.WorkCreateRequestDto;
import com.backend.kidsnomy.work.service.WorkService;
import jakarta.servlet.http.HttpServletRequest;
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
}
