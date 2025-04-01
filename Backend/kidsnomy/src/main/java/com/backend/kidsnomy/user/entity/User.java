package com.backend.kidsnomy.user.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @Column(nullable = false, length = 100)
    private String password;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(name = "is_parent")
    private Boolean isParent;

    @Column(name = "user_key", length = 70)
    private String userKey;

    private Integer age;

    private String gender;

    @Column(name = "parent_email", length = 50)
    private String parentEmail;

    public User() {}

    public User(String email, String password, String name,
                Boolean isParent, Integer age, String gender, String userKey) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.isParent = isParent;
        this.age = age;
        this.gender = gender;
        this.userKey = userKey;
    }

    // Getter/Setter 생략 없이 필요 시만 직접 추가
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getName() { return name; }
    public Boolean getIsParent() { return isParent; }
    public String getUserKey() { return userKey; }
    public Integer getAge() { return age; }
    public String getGender() { return gender; }
    public String getParentEmail() { return parentEmail; }

    public void setUserKey(String userKey) {
        this.userKey = userKey;
    }
    public void setParentEmail(String parentEmail) {
        this.parentEmail = parentEmail;
    }
}
