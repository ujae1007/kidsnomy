package com.backend.kidsnomy.group.dto;

public class GroupCreateResponseDto {

    private String groupCode;

    public GroupCreateResponseDto() {}

    public GroupCreateResponseDto(String groupCode) {
        this.groupCode = groupCode;
    }

    public String getGroupCode() {
        return groupCode;
    }

    public void setGroupCode(String groupCode) {
        this.groupCode = groupCode;
    }
}
