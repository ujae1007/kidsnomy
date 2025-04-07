package com.backend.kidsnomy.basic.repository;

import com.backend.kidsnomy.basic.entity.AccountLog;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountLogRepository extends JpaRepository<AccountLog, Integer> {
	boolean existsByTransactionUniqueNo(String transactionUniqueNo);
	
	List<AccountLog> findAllByAccountNo(String accountNo);
	
	List<AccountLog> findByAccountNoOrderByTransactionDateDescTransactionTimeDesc(String accountNo);

}