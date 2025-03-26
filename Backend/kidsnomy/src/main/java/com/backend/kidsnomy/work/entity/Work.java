package com.backend.kidsnomy.work.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "job")
public class Work {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "group_id", nullable = false)
    private Long groupId;

    @Column(name = "employer_id", nullable = false)
    private Long employerId;

    @Column(name = "employee_id")
    private Long employeeId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "salary", nullable = false)
    private BigDecimal salary;

    @Column(name = "reward_text")
    private String rewardText;

    @Column(name = "is_permanent")
    private Boolean isPermanent;

    @Column(name = "start_at")
    private LocalDate startAt;

    @Column(name = "end_at")
    private LocalDateTime endAt;

    @Column(name = "status")
    private Integer status;

    // 기본 생성자
    public Work() {}

    // getter/setter 
    public Long getId() { return id; }

    public Long getGroupId() { return groupId; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }

    public Long getEmployerId() { return employerId; }
    public void setEmployerId(Long employerId) { this.employerId = employerId; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public BigDecimal getSalary() { return salary; }
    public void setSalary(BigDecimal salary) { this.salary = salary; }

    public String getRewardText() { return rewardText; }
    public void setRewardText(String rewardText) { this.rewardText = rewardText; }

    public Boolean getIsPermanent() { return isPermanent; }
    public void setIsPermanent(Boolean isPermanent) { this.isPermanent = isPermanent; }

    public LocalDate getStartAt() { return startAt; }
    public void setStartAt(LocalDate startAt) { this.startAt = startAt; }

    public LocalDateTime getEndAt() { return endAt; }
    public void setEndAt(LocalDateTime endAt) { this.endAt = endAt; }

    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
}
