package com.backend.kidsnomy.basic.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.backend.kidsnomy.basic.dto.BasicProductRequestDto;
import com.backend.kidsnomy.basic.dto.BasicProductResponseDto;
import com.backend.kidsnomy.basic.service.BasicProductService;

@RestController
@RequestMapping("/api/basic")
public class BasicProductController {

    private final BasicProductService basicProductService;

    // @Autowired 생략 - Spring 4.3+ 버전에서 생략 가능하다고 함
    public BasicProductController(BasicProductService basicProductService) {
        this.basicProductService = basicProductService;
    }

    @PostMapping("/create")
    public ResponseEntity<BasicProductResponseDto> createProduct(@Valid @RequestBody BasicProductRequestDto requestDto, HttpServletRequest request) {
        BasicProductResponseDto responseDto = basicProductService.createProduct(request, requestDto);
        return ResponseEntity.ok(responseDto);
    }
}