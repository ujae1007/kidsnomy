package com.backend.kidsnomy.group.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "group_info")
public class GroupInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "group_code", nullable = false, unique = true)
    private String groupCode;

    @Column(name = "owner_id", nullable = false)
    private Long ownerId;

    public GroupInfo() {}

    public GroupInfo(String groupCode, Long ownerId) {
        this.groupCode = groupCode;
        this.ownerId = ownerId;
    }

    public Long getId() {
        return id;
    }

    public String getGroupCode() {
        return groupCode;
    }

    public void setGroupCode(String groupCode) {
        this.groupCode = groupCode;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }
}
