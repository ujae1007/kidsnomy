package com.backend.kidsnomy.basic.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.backend.kidsnomy.basic.dto.BasicAccountRequestDto;
import com.backend.kidsnomy.basic.dto.BasicAccountResponseDto;
import com.backend.kidsnomy.basic.service.BasicAccountService;

@RestController
@RequestMapping("/api/basic/account")
public class BasicAccountController {

    @Autowired
    private BasicAccountService basicAccountService;

    @PostMapping("/create")
    public ResponseEntity<BasicAccountResponseDto> createAccount(@RequestBody BasicAccountRequestDto requestDto) {
        BasicAccountResponseDto responseDto = basicAccountService.createAccount(requestDto);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BasicAccountResponseDto> getAccount(@PathVariable Long id) {
        BasicAccountResponseDto responseDto = basicAccountService.getAccount(id);
        return ResponseEntity.ok(responseDto);
    }
}
