package com.backend.kidsnomy.work.dto;

import com.backend.kidsnomy.work.entity.Work;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ParentWorkListResponseDto {

    private Long jobId;
    private Long groupId;
    private String groupCode;
    private Long employerId;
    private Long employeeId;
    private String title;
    private String content;
    private BigDecimal salary;
    private String rewardText;
    private Boolean isPermanent;
    private LocalDate startAt;
    private LocalDateTime endAt;
    private Integer status;

    public ParentWorkListResponseDto() {}

    public static ParentWorkListResponseDto fromEntity(Work work, String groupCode) {
        ParentWorkListResponseDto dto = new ParentWorkListResponseDto();
        dto.jobId = work.getId();
        dto.groupId = work.getGroupId();
        dto.groupCode = groupCode;
        dto.employerId = work.getEmployerId();
        dto.employeeId = work.getEmployeeId();
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

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public String getGroupCode() {
        return groupCode;
    }

    public void setGroupCode(String groupCode) {
        this.groupCode = groupCode;
    }

    public Long getEmployerId() {
        return employerId;
    }

    public void setEmployerId(Long employerId) {
        this.employerId = employerId;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public BigDecimal getSalary() {
        return salary;
    }

    public void setSalary(BigDecimal salary) {
        this.salary = salary;
    }

    public String getRewardText() {
        return rewardText;
    }

    public void setRewardText(String rewardText) {
        this.rewardText = rewardText;
    }

    public Boolean getIsPermanent() {
        return isPermanent;
    }

    public void setIsPermanent(Boolean isPermanent) {
        this.isPermanent = isPermanent;
    }

    public LocalDate getStartAt() {
        return startAt;
    }

    public void setStartAt(LocalDate startAt) {
        this.startAt = startAt;
    }

    public LocalDateTime getEndAt() {
        return endAt;
    }

    public void setEndAt(LocalDateTime endAt) {
        this.endAt = endAt;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
