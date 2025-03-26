package com.backend.kidsnomy.user.dto;

public class SignUpChildRequestDto {
    private String email;
    private String password;
    private String name;
    private int age;
    private String gender;
    private String parentEmail;

    public SignUpChildRequestDto() {}

    public SignUpChildRequestDto(String email, String password, String name, int age, String gender, String parentEmail) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.parentEmail = parentEmail;
    }

    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getName() { return name; }
    public int getAge() { return age; }
    public String getGender() { return gender; }
    public String getParentEmail() { return parentEmail; }
}
