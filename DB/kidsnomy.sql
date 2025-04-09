-- 데이터베이스 생성 및 기본 문자 집합 설정
DROP DATABASE IF EXISTS `kidsnomy`;
CREATE DATABASE `kidsnomy` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `kidsnomy`;

-- user 테이블
CREATE TABLE `user` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(100) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `is_parent` BOOLEAN,
  `user_key` VARCHAR(70),
  `age` INT,
  `gender` VARCHAR(10),
  `parent_email` VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- email_verification 테이블
CREATE TABLE `email_verification` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(50) NOT NULL,
  `verification_code` INT,
  `status` BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- group_info 테이블
CREATE TABLE `group_info` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `group_code` VARCHAR(8) NOT NULL UNIQUE,
  `owner_id` INT NOT NULL,
  FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- group_membership 테이블
CREATE TABLE `group_membership` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `group_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`group_id`) REFERENCES `group_info`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- basic_account 테이블
CREATE TABLE `basic_account` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `account_no` VARCHAR(50) NOT NULL UNIQUE,
  `account_password` INT,
  `balance` DECIMAL(15,2) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- basic_product 테이블
CREATE TABLE `basic_product` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `account_type_unique_no` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 기본 상품 정보 삽입
INSERT INTO `basic_product` (`account_type_unique_no`)
VALUES ('999-1-ac6833c1ba1542');

-- account_log 테이블
CREATE TABLE `account_log` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `account_no` VARCHAR(50) NOT NULL,
  `transaction_account_no` VARCHAR(70),
  `transaction_unique_no` VARCHAR(50) NOT NULL UNIQUE,
  `transaction_date` VARCHAR(20),
  `transaction_time` VARCHAR(20),
  `transaction_type` TINYINT,
  `transaction_balance` DECIMAL(15,2),
  `transaction_after_balance` DECIMAL(15,2),
  `transaction_summary` VARCHAR(255),
  `transaction_memo` VARCHAR(255),
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`account_no`) REFERENCES `basic_account`(`account_no`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- job 테이블
CREATE TABLE `job` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `group_id` INT NOT NULL,
  `employer_id` INT NOT NULL,
  `employee_id` INT NULL,
  `title` VARCHAR(50),
  `content` TEXT,
  `salary` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `reward_text` VARCHAR(100),
  `is_permanent` TINYINT,
  `start_at` TIMESTAMP,
  `end_at` TIMESTAMP,
  `status` TINYINT,
  FOREIGN KEY (`group_id`) REFERENCES `group_info`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`employer_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`employee_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- status_mapping 테이블
CREATE TABLE `status_mapping` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `status_info` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 상태 코드 삽입
INSERT INTO status_mapping (id, status_info) VALUES
(1, '계약전'),
(2, '계약후'),
(3, '승인대기'),
(4, '최종완료');

-- deposit 테이블
CREATE TABLE `deposit` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `group_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `title` VARCHAR(50),
  `content` TEXT,
  `interest_rate` DECIMAL(5,2),
  `due_date` INT,
  `product_type` TINYINT DEFAULT 0,
  FOREIGN KEY (`group_id`) REFERENCES `group_info`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- savings 테이블
CREATE TABLE `savings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `group_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `title` VARCHAR(50),
  `content` TEXT,
  `interest_rate` DECIMAL(5,2),
  `due_date` INT,
  `rate_date` INT,
  `pay_date` INT,
  `product_type` TINYINT DEFAULT 1,
  FOREIGN KEY (`group_id`) REFERENCES `group_info`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- deposit_contract 테이블 (수정: group_id 추가)
CREATE TABLE `deposit_contract` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `group_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `start_day` TIMESTAMP,
  `end_day` TIMESTAMP,
  `account_no` VARCHAR(50) NOT NULL UNIQUE,
  `balancedeposit` DECIMAL(15,2) DEFAULT 0,
  `total_volume` DECIMAL(15,2),
  `status` TINYINT DEFAULT 0 COMMENT '0: 활성, 1: 해지',
  FOREIGN KEY (`group_id`) REFERENCES `group_info`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `deposit`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- savings_contract 테이블 (수정: group_id 추가)
CREATE TABLE `savings_contract` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `group_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `start_day` TIMESTAMP,
  `end_day` TIMESTAMP,
  `account_no` VARCHAR(50) NOT NULL UNIQUE,
  `balance` DECIMAL(15,2) DEFAULT 0,
  `one_time_volume` DECIMAL(15,2),
  `rate_volume` DECIMAL(15,2) DEFAULT 0,
  `status` TINYINT DEFAULT 0 COMMENT '0: 활성, 1: 해지',
  FOREIGN KEY (`group_id`) REFERENCES `group_info`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `savings`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- deposit_log 테이블
CREATE TABLE `deposit_log` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `account_no` VARCHAR(50) NOT NULL,
  `transaction_unique_no` VARCHAR(50) NOT NULL UNIQUE,
  `transaction_date` VARCHAR(20),
  `transaction_time` VARCHAR(20),
  `transaction_type` BOOLEAN,
  `transaction_balance` DECIMAL(15,2),
  `transaction_after_balance` DECIMAL(15,2),
  `transaction_summary` VARCHAR(255),
  `transaction_memo` VARCHAR(255),
  `product_type` TINYINT DEFAULT 0,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`account_no`) REFERENCES `deposit_contract`(`account_no`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- savings_log 테이블
CREATE TABLE `savings_log` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `account_no` VARCHAR(50) NOT NULL,
  `transaction_unique_no` VARCHAR(50) NOT NULL UNIQUE,
  `transaction_date` VARCHAR(20),
  `transaction_time` VARCHAR(20),
  `transaction_type` BOOLEAN,
  `transaction_balance` DECIMAL(15,2),
  `transaction_after_balance` DECIMAL(15,2),
  `transaction_summary` VARCHAR(255),
  `transaction_memo` VARCHAR(255),
  `product_type` TINYINT DEFAULT 1,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`account_no`) REFERENCES `savings_contract`(`account_no`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- user_refresh_token 테이블
CREATE TABLE `user_refresh_token` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `refresh_token` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `expired_at` TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
