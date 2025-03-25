package com.backend.kidsnomy.group.dto;

public class GroupParticipationRequestDto {

    private String groupCode;

    public GroupParticipationRequestDto() {}

    public GroupParticipationRequestDto(String groupCode) {
        this.groupCode = groupCode;
    }

    public String getGroupCode() {
        return groupCode;
    }

    public void setGroupCode(String groupCode) {
        this.groupCode = groupCode;
    }
}
