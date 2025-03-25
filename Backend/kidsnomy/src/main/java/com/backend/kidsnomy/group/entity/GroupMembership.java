package com.backend.kidsnomy.group.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "group_membership")
public class GroupMembership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "group_id", nullable = false)
    private Long groupId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    public GroupMembership() {}

    public GroupMembership(Long groupId, Long userId) {
        this.groupId = groupId;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
