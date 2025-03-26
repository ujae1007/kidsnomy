package com.backend.kidsnomy.basic.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.backend.kidsnomy.basic.dto.BasicProductRequestDto;
import com.backend.kidsnomy.basic.dto.BasicProductResponseDto;
import com.backend.kidsnomy.basic.service.BasicProductService;

@RestController
@RequestMapping("/api/basic/product")
public class BasicProductController {

    @Autowired
    private BasicProductService basicProductService;

    @PostMapping("/create")
    public ResponseEntity<BasicProductResponseDto> createProduct(@RequestBody BasicProductRequestDto requestDto) {
        BasicProductResponseDto responseDto = basicProductService.createProduct(requestDto);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BasicProductResponseDto> getProduct(@PathVariable Long id) {
        BasicProductResponseDto responseDto = basicProductService.getProduct(id);
        return ResponseEntity.ok(responseDto);
    }
}