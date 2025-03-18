package com.study.content.security.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.study.content.security.dto.JoinDTO;
import com.study.content.security.entity.User;
import com.study.content.security.repository.UserRepository;

@Service
public class JoinService {

	private final UserRepository userRepository;
	private final BCryptPasswordEncoder bCryptPasswordEncoder;
	
	public JoinService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
		this.userRepository = userRepository;
		this.bCryptPasswordEncoder = bCryptPasswordEncoder;
	}
	
	public void joinProcess(JoinDTO joinDTO) {
		String username = joinDTO.getUsername();
		String password = joinDTO.getPassword();
	
		Boolean isExist = userRepository.existsByUsername(username);
		
		if (isExist) {
			
			return ;
		}
		
		User user = new User();
		
		user.setUsername(username);
		user.setPassword(bCryptPasswordEncoder.encode(password));
		user.setRole("Role Admin");
		
		userRepository.save(user);
	}
}
