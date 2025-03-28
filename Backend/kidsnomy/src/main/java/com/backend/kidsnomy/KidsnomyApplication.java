package com.backend.kidsnomy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class KidsnomyApplication {

	public static void main(String[] args) {
		SpringApplication.run(KidsnomyApplication.class, args);
	}

}
