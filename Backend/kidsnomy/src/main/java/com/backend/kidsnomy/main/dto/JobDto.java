package com.backend.kidsnomy.main.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class JobDto {
    private Long id;
    private Long groupId;
    private Long employerId;
    private Long employeeId;
    private String title;
    private String content;
    private BigDecimal salary;
    private String rewardText;
    private Integer isPermanent;
    private LocalDate startAt;
    private LocalDateTime endAt;
    private Integer status;

    public JobDto() {}

    public JobDto(Long id, Long groupId, Long employerId, Long employeeId,
                  String title, String content, BigDecimal salary,
                  String rewardText, Integer isPermanent,
                  LocalDate startAt, LocalDateTime endAt, Integer status) {
        this.id = id;
        this.groupId = groupId;
        this.employerId = employerId;
        this.employeeId = employeeId;
        this.title = title;
        this.content = content;
        this.salary = salary;
        this.rewardText = rewardText;
        this.isPermanent = isPermanent;
        this.startAt = startAt;
        this.endAt = endAt;
        this.status = status;
    }

    public Long getId() { return id; }
    public Long getGroupId() { return groupId; }
    public Long getEmployerId() { return employerId; }
    public Long getEmployeeId() { return employeeId; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public BigDecimal getSalary() { return salary; }
    public String getRewardText() { return rewardText; }
    public Integer getIsPermanent() { return isPermanent; }
    public LocalDate getStartAt() { return startAt; }
    public LocalDateTime getEndAt() { return endAt; }
    public Integer getStatus() { return status; }

    public void setId(Long id) { this.id = id; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }
    public void setEmployerId(Long employerId) { this.employerId = employerId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public void setTitle(String title) { this.title = title; }
    public void setContent(String content) { this.content = content; }
    public void setSalary(BigDecimal salary) { this.salary = salary; }
    public void setRewardText(String rewardText) { this.rewardText = rewardText; }
    public void setIsPermanent(Integer isPermanent) { this.isPermanent = isPermanent; }
    public void setStartAt(LocalDate startAt) { this.startAt = startAt; }
    public void setEndAt(LocalDateTime endAt) { this.endAt = endAt; }
    public void setStatus(Integer status) { this.status = status; }
}
