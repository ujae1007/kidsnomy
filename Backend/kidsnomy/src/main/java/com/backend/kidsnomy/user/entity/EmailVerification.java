package com.backend.kidsnomy.user.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "email_verification")
public class EmailVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String email;

    @Column(name = "verification_code")
    private Integer verificationCode;

    @Column(nullable = false)
    private Boolean status = false;

    public EmailVerification() {}

    public EmailVerification(String email, Integer verificationCode) {
        this.email = email;
        this.verificationCode = verificationCode;
        this.status = false;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public Integer getVerificationCode() { return verificationCode; }
    public Boolean getStatus() { return status; }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public void setVerificationCode(Integer verificationCode) {
        this.verificationCode = verificationCode;
    }
}
