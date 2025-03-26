package com.study.content.security.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.study.content.security.dto.JoinDTO;
import com.study.content.security.service.JoinService;

@Controller
@ResponseBody
@CrossOrigin(origins = "http://localhost:5173") // React 서버 주소 허용
public class JoinController {
	
	private final JoinService joinService;

	public JoinController(JoinService joinService) {
		this.joinService = joinService;
	}
	
	@PostMapping("/join")
	public String joinProcess(JoinDTO joinDTO) {
		
		joinService.joinProcess(joinDTO);
		
		return "ok";
	}
}
