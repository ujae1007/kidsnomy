package com.backend.kidsnomy.user.dto;

public class SignUpParentRequestDto {

    private String email;
    private String password;
    private String name;
    private int age;
    private String gender; // "Male" or "FeMale"

    public SignUpParentRequestDto() {
    }

    public SignUpParentRequestDto(String email, String password, String name, int age, String gender) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.age = age;
        this.gender = gender;
    }

    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getName() { return name; }
    public int getAge() { return age; }
    public String getGender() { return gender; }
}