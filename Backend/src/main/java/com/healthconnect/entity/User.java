package com.healthconnect.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    private String fullName;

    private String email;

    private String mobile;


    // ==========================================
    // LOGIN INFORMATION
    // ==========================================

    @Column(unique = true, nullable = false)
    private String username;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;


    // ==========================================
    // ROLE
    // USER / DOCTOR / STUDENT / ADMIN
    // ==========================================

    private String role;


    // ==========================================
    // HOSPITAL ASSOCIATION
    // ==========================================

    /*
     * Stores the hospital where the patient
     * is associated.
     *
     * Example:
     * District Hospital Raipur
     */
    private String hospitalName;


    // ==========================================
    // DEFAULT CONSTRUCTOR
    // ==========================================

    public User() {
    }


    // ==========================================
    // PARAMETERIZED CONSTRUCTOR
    // ==========================================

    public User(
            String fullName,
            String email,
            String mobile,
            String username,
            String password) {

        this.fullName = fullName;
        this.email = email;
        this.mobile = mobile;
        this.username = username;
        this.password = password;

        this.role = "USER";
    }


    // ==========================================
    // GETTERS & SETTERS
    // ==========================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }


    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }
}