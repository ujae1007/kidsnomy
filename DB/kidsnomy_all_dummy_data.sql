-- user 테이블
INSERT INTO `user` (`email`, `password`, `name`, `is_parent`, `user_key`, `age`, `gender`, `parent_email`)
VALUES 
('user1@example.com', 'encrypted_pw', '권영자', False, '7c65c1e5-82e2-4662-b728-b4fa42485e3a', 36, 'Male', 'None'),
('user2@example.com', 'encrypted_pw', '안성민', False, 'e443df78-9558-467f-9ba9-1faf7a024204', 42, 'Female', 'user1@example.com'),
('user3@example.com', 'encrypted_pw', '박수빈', False, 'cca5a5a1-9e4d-4e3c-9846-d424c17c6279', 29, 'Female', 'None'),
('user4@example.com', 'encrypted_pw', '백현준', False, '259f4329-e6f4-490b-9a16-4106cf6a659e', 47, 'Male', 'user1@example.com'),
('user5@example.com', 'encrypted_pw', '서지후', True, '8f4ff31e-78de-4857-9487-ce1eaf19922a', 28, 'Male', 'None');

-- group_info
INSERT INTO `group_info` (`group_code`, `owner_id`)
VALUES 
('GRP12025', 1),
('GRP22025', 2);

-- group_membership
INSERT INTO `group_membership` (`group_id`, `user_id`)
VALUES 
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 2), (2, 3);

-- basic_account
INSERT INTO `basic_account` (`user_id`, `account_no`, `account_password`, `balance`, `created_at`)
VALUES 
(1, 'ACCT2025001', 1234, 40232.17, '2025-04-01 04:57:32'),
(2, 'ACCT2025002', 1234, 34734.76, '2025-04-01 04:57:32'),
(3, 'ACCT2025003', 1234, 20020.25, '2025-04-01 04:57:32'),
(4, 'ACCT2025004', 1234, 46389.85, '2025-04-01 04:57:32'),
(5, 'ACCT2025005', 1234, 49311.42, '2025-04-01 04:57:32');

-- basic_product
INSERT INTO `basic_product` (`account_type_unique_no`)
VALUES ('BASIC-2025-001');

-- account_log
INSERT INTO `account_log` (`user_id`, `account_no`, `transaction_account_no`, `transaction_unique_no`, `transaction_date`, `transaction_time`, `transaction_type`, `transaction_balance`, `transaction_after_balance`, `transaction_summary`, `transaction_memo`)
VALUES 
(1, 'ACCT2025001', '입금', 'TXN00001', '2025-04-01 04:57:32', '2025-04-01 04:57:32', 1, 10000, 40232.17, '테스트 입금', '입금 테스트'),
(2, 'ACCT2025002', '입금', 'TXN00002', '2025-04-01 04:57:32', '2025-04-01 04:57:32', 1, 10000, 34734.76, '테스트 입금', '입금 테스트'),
(3, 'ACCT2025003', '입금', 'TXN00003', '2025-04-01 04:57:32', '2025-04-01 04:57:32', 1, 10000, 20020.25, '테스트 입금', '입금 테스트'),
(4, 'ACCT2025004', '입금', 'TXN00004', '2025-04-01 04:57:32', '2025-04-01 04:57:32', 1, 10000, 46389.85, '테스트 입금', '입금 테스트'),
(5, 'ACCT2025005', '입금', 'TXN00005', '2025-04-01 04:57:32', '2025-04-01 04:57:32', 1, 10000, 49311.42, '테스트 입금', '입금 테스트');

-- email_verification
INSERT INTO `email_verification` (`email`, `verification_code`, `status`)
VALUES 
('user1@example.com', 949574, True),
('user2@example.com', 731140, False),
('user3@example.com', 254100, True),
('user4@example.com', 425213, False),
('user5@example.com', 203560, True);

-- job
INSERT INTO `job` (`group_id`, `employer_id`, `employee_id`, `title`, `content`, `salary`, `reward_text`, `is_permanent`, `start_at`, `end_at`, `status`)
VALUES 
(1, 5, 1, '일자리1', '일자리 내용 1', 2459.66, '사탕 한 봉지', 0, '2025-04-01 05:03:00', '2025-04-08 05:03:00', 3),
(1, 5, NULL, '일자리2', '일자리 내용 2', 1660.39, '사탕 한 봉지', 0, '2025-04-01 05:03:00', '2025-04-08 05:03:00', 3),
(2, 5, 3, '일자리3', '일자리 내용 3', 1201.4, '사탕 한 봉지', 0, '2025-04-01 05:03:00', '2025-04-08 05:03:00', 2),
(2, 5, NULL, '일자리4', '일자리 내용 4', 1632.39, '사탕 한 봉지', 0, '2025-04-01 05:03:00', '2025-04-08 05:03:00', 3),
(2, 5, 5, '일자리5', '일자리 내용 5', 2826.02, '사탕 한 봉지', 0, '2025-04-01 05:03:00', '2025-04-08 05:03:00', 3);

-- status_mapping
INSERT INTO `status_mapping` (`status_info`)
VALUES ('계약전'), ('계약후'), ('승인대기'), ('최종완료');

-- deposit
INSERT INTO `deposit` (`group_id`, `user_id`, `title`, `content`, `interest_rate`, `due_date`, `product_type`)
VALUES 
(1, 1, '정기예금 상품1', '정기예금 설명 1', 3.5, 12, 0),
(1, 2, '정기예금 상품2', '정기예금 설명 2', 3.5, 12, 0),
(1, 3, '정기예금 상품3', '정기예금 설명 3', 3.5, 12, 0);

-- savings
INSERT INTO `savings` (`group_id`, `user_id`, `title`, `content`, `interest_rate`, `due_date`, `rate_date`, `pay_date`, `product_type`)
VALUES 
(2, 1, '적금 상품1', '적금 설명 1', 4.0, 12, 1, 15, 1),
(2, 2, '적금 상품2', '적금 설명 2', 4.0, 12, 1, 15, 1),
(2, 3, '적금 상품3', '적금 설명 3', 4.0, 12, 1, 15, 1);

-- deposit_contract
INSERT INTO `deposit_contract` (`group_id`, `user_id`, `product_id`, `start_day`, `end_day`, `account_no`, `balancedeposit`, `total_volume`)
VALUES 
(1, 1, 1, '2025-04-01 05:03:00', '2026-04-01 05:03:00', 'DPT2025001', 100000, 100000),
(1, 2, 2, '2025-04-01 05:03:00', '2026-04-01 05:03:00', 'DPT2025002', 100000, 100000);

-- savings_contract
INSERT INTO `savings_contract` (`group_id`, `user_id`, `product_id`, `start_day`, `end_day`, `account_no`, `balance`, `one_time_volume`, `rate_volume`)
VALUES 
(2, 1, 1, '2025-04-01 05:03:00', '2026-04-01 05:03:00', 'SVG2025001', 200000, 50000, 20000),
(2, 2, 2, '2025-04-01 05:03:00', '2026-04-01 05:03:00', 'SVG2025002', 200000, 50000, 20000);

-- deposit_log
INSERT INTO `deposit_log` (`user_id`, `account_no`, `transaction_unique_no`, `transaction_date`, `transaction_time`, `transaction_type`, `transaction_balance`, `transaction_after_balance`, `transaction_summary`, `transaction_memo`, `product_type`)
VALUES 
(1, 'DPT2025001', 'DLTXN00001', '2025-04-01 05:03:00', '2025-04-01 05:03:00', 1, 50000, 100000, '예금 입금', '첫 입금', 0),
(2, 'DPT2025002', 'DLTXN00002', '2025-04-01 05:03:00', '2025-04-01 05:03:00', 1, 50000, 100000, '예금 입금', '첫 입금', 0);

-- savings_log
INSERT INTO `savings_log` (`user_id`, `account_no`, `transaction_unique_no`, `transaction_date`, `transaction_time`, `transaction_type`, `transaction_balance`, `transaction_after_balance`, `transaction_summary`, `transaction_memo`, `product_type`)
VALUES 
(1, 'SVG2025001', 'SVTXN00001', '2025-04-01 05:03:00', '2025-04-01 05:03:00', 1, 50000, 200000, '적금 입금', '첫 적금', 1),
(2, 'SVG2025002', 'SVTXN00002', '2025-04-01 05:03:00', '2025-04-01 05:03:00', 1, 50000, 200000, '적금 입금', '첫 적금', 1);

-- user_refresh_token
INSERT INTO `user_refresh_token` (`user_id`, `refresh_token`, `created_at`, `expired_at`)
VALUES 
(1, '5c349dfed0a500a5a90e780e6a1b504d16324283aa9b8f36afdd2ebcd826a28b', '2025-04-01 05:03:00', '2025-04-02 05:03:00'),
(2, '8ee1caca033ef56c2f197a26f0cdfbd84ba3d1b75a97f9f39011f724fd70e579', '2025-04-01 05:03:00', '2025-04-02 05:03:00');