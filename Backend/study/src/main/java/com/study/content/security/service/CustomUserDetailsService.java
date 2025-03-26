package com.study.content.security.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.study.content.security.dto.CustomUserDetails;
import com.study.content.security.entity.User;
import com.study.content.security.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {
	
	private final UserRepository userRepository;
	
	public CustomUserDetailsService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
		
		User userData = userRepository.findByUsername(username);
		
		if (userData != null) {
			
			return new CustomUserDetails(userData);
		}
		
		return null;
	}
}
