package com.backend.kidsnomy.main.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "job")
public class JobEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "group_id", nullable = false)
    private Long groupId;

    @Column(name = "employer_id", nullable = false)
    private Long employerId;

    @Column(name = "employee_id")
    private Long employeeId;

    @Column(name = "title")
    private String title;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "salary", nullable = false)
    private BigDecimal salary;

    @Column(name = "reward_text")
    private String rewardText;

    @Column(name = "is_permanent")
    private Integer isPermanent;

    @Column(name = "start_at")
    private LocalDate startAt;

    @Column(name = "end_at")
    private LocalDateTime endAt;

    @Column(name = "status")
    private Integer status;

    public JobEntity() {}

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
