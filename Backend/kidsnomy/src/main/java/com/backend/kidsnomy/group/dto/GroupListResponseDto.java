package com.backend.kidsnomy.group.dto;

public class GroupListResponseDto {

    private Long groupId;
    private String groupCode;
    private String ownerName;

    public GroupListResponseDto() {}

    public GroupListResponseDto(Long groupId, String groupCode, String ownerName) {
        this.groupId = groupId;
        this.groupCode = groupCode;
        this.ownerName = ownerName;
    }

    public Long getGroupId() {
        return groupId;
    }

    public String getGroupCode() {
        return groupCode;
    }

    public String getOwnerName() {
        return ownerName;
    }
}
