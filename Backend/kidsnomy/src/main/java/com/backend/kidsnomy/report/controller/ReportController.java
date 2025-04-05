package com.backend.kidsnomy.report.controller;

import com.backend.kidsnomy.report.service.ReportService;
import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

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
    public ResponseEntity<Map<String, Object>> sendReport(HttpServletRequest request) {
        Map<String, Object> result = reportService.sendWeeklyTransactionReport(request);
        return ResponseEntity.ok(result);
    }

}
