package com.study.content.security.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.study.content.security.entity.User;

public interface UserRepository extends JpaRepository<User, Integer>{
	
	Boolean existsByUsername(String username);
	
	User findByUsername(String username);
}
