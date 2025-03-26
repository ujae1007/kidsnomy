package com.backend.kidsnomy.work.dto;

import com.backend.kidsnomy.user.entity.User;
import com.backend.kidsnomy.work.entity.Work;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ChildContractedWorkResponseDto {

    private Long jobId;
    private String groupCode;
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
    private LocalDateTime endAt;
    private Integer status;

    public ChildContractedWorkResponseDto() {}

    public static ChildContractedWorkResponseDto fromEntity(Work work, String groupCode, User employer, User employee) {
        ChildContractedWorkResponseDto dto = new ChildContractedWorkResponseDto();
        dto.jobId = work.getId();
        dto.groupCode = groupCode;
        dto.employerId = work.getEmployerId();
        dto.employeeId = work.getEmployeeId();
        dto.employerName = employer != null ? employer.getName() : null;
        dto.employeeName = employee != null ? employee.getName() : null;
        dto.title = work.getTitle();
        dto.content = work.getContent();
        dto.salary = work.getSalary();
        dto.rewardText = work.getRewardText();
        dto.isPermanent = work.getIsPermanent();
        dto.startAt = work.getStartAt();
        dto.endAt = work.getEndAt();
        dto.status = work.getStatus();
        return dto;
    }

    // Getter / Setter
    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getGroupCode() { return groupCode; }
    public void setGroupCode(String groupCode) { this.groupCode = groupCode; }

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

    public LocalDateTime getEndAt() { return endAt; }
    public void setEndAt(LocalDateTime endAt) { this.endAt = endAt; }

    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
}
