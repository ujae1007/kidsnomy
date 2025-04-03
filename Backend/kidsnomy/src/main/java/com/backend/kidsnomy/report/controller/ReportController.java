package com.backend.kidsnomy.report.controller;

import com.backend.kidsnomy.report.service.ReportService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/report")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping("/finance")
    public ResponseEntity<String> sendReport(HttpServletRequest request) {
        reportService.sendWeeklyTransactionReport(request);
        return ResponseEntity.ok("리포트 전송 완료");
    }
}
