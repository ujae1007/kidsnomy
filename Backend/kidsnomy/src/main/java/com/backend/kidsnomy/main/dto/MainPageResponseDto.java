package com.backend.kidsnomy.main.dto;

import java.util.List;

import com.backend.kidsnomy.main.dto.*;

public class MainPageResponseDto {
	
	private String name;
	
    private AccountDto account;
    private List<JobDto> jobs;
    private List<DepositDto> deposits;
    private List<DepositContractDto> depositContracts;
    private List<SavingsDto> savings;
    private List<SavingsContractDto> savingsContracts;

    public MainPageResponseDto() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public AccountDto getAccount() { return account; }
    public List<JobDto> getJobs() { return jobs; }
    public List<DepositDto> getDeposits() { return deposits; }
    public List<DepositContractDto> getDepositContracts() { return depositContracts; }
    public List<SavingsDto> getSavings() { return savings; }
    public List<SavingsContractDto> getSavingsContracts() { return savingsContracts; }

    public void setAccount(AccountDto account) { this.account = account; }
    public void setJobs(List<JobDto> jobs) { this.jobs = jobs; }
    public void setDeposits(List<DepositDto> deposits) { this.deposits = deposits; }
    public void setDepositContracts(List<DepositContractDto> depositContracts) { this.depositContracts = depositContracts; }
    public void setSavings(List<SavingsDto> savings) { this.savings = savings; }
    public void setSavingsContracts(List<SavingsContractDto> savingsContracts) { this.savingsContracts = savingsContracts; }
}
