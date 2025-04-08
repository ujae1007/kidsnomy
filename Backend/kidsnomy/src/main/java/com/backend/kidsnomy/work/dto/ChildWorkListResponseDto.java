package com.backend.kidsnomy.work.dto;

import com.backend.kidsnomy.user.entity.User;
import com.backend.kidsnomy.work.entity.Work;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ChildWorkListResponseDto {

    private Long jobId;
    private Long groupId;
    private Long employerId;
    private Long employeeId;
    private String employerName;
    private String employeeName;
    private String title;
    private String content;
    private BigDecimal salary;
    private String rewardText;
    private Boolean isPermanent;
    private LocalDate startAt;
    private LocalDate endAt;
    private Integer status;

    public static ChildWorkListResponseDto fromEntity(Work work, User employer, User employee) {
        ChildWorkListResponseDto dto = new ChildWorkListResponseDto();
        dto.setJobId(work.getId());
        dto.setGroupId(work.getGroupId());
        dto.setEmployerId(work.getEmployerId());
        dto.setEmployeeId(work.getEmployeeId());
        dto.setEmployerName(employer != null ? employer.getName() : null);
        dto.setEmployeeName(employee != null ? employee.getName() : null);
        dto.setTitle(work.getTitle());
        dto.setContent(work.getContent());
        dto.setSalary(work.getSalary());
        dto.setRewardText(work.getRewardText());
        dto.setIsPermanent(work.getIsPermanent());
        dto.setStartAt(work.getStartAt());
        dto.setEndAt(work.getEndAt() != null ? work.getEndAt().toLocalDate() : null);
        dto.setStatus(work.getStatus());
        return dto;
    }

    // Getter / Setter
    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public Long getGroupId() { return groupId; }
    public void setGroupId(Long groupId) { this.groupId = groupId; }

    public Long getEmployerId() { return employerId; }
    public void setEmployerId(Long employerId) { this.employerId = employerId; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getEmployerName() { return employerName; }
    public void setEmployerName(String employerName) { this.employerName = employerName; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

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

    public LocalDate getEndAt() { return endAt; }
    public void setEndAt(LocalDate endAt) { this.endAt = endAt; }

    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
}
