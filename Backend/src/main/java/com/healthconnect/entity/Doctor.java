package com.healthconnect.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    private String mobile;

    @Column(unique = true, nullable = false)
    private String username;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;


    // ==========================================
    // PROFESSIONAL INFORMATION
    // ==========================================

    @Column(nullable = false)
    private String specialization;

    @Column(nullable = false)
    private String qualification;

    private Integer experience;

    private Double consultationFee;


    // ==========================================
    // DOCTOR TYPE
    // ==========================================

    @Column(nullable = false)
    private String doctorType;


    // ==========================================
    // DOCTOR UNIQUE IDENTITY NUMBER
    // ==========================================

    @Column(
            name = "doctor_identity_number",
            unique = true,
            nullable = false,
            length = 100
    )
    private String doctorIdentityNumber;


    // ==========================================
    // LOCATION
    // ==========================================

    private String location;


    // ==========================================
    // HOSPITAL
    // ==========================================

    private String hospitalName;

    private String hospitalAddress;


    // ==========================================
    // AVAILABILITY
    // ==========================================

    @Column(nullable = false)
    private Boolean available = true;


    // ==========================================
    // STATUS
    // ==========================================

    @Column(nullable = false)
    private String status = "PENDING";


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public Doctor() {
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


    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }


    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }


    public Integer getExperience() {
        return experience;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }


    public Double getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(Double consultationFee) {
        this.consultationFee = consultationFee;
    }


    public String getDoctorType() {
        return doctorType;
    }

    public void setDoctorType(String doctorType) {
        this.doctorType = doctorType;
    }


    // ==========================================
    // DOCTOR IDENTITY NUMBER
    // ==========================================

    public String getDoctorIdentityNumber() {
        return doctorIdentityNumber;
    }

    public void setDoctorIdentityNumber(
            String doctorIdentityNumber) {

        this.doctorIdentityNumber =
                doctorIdentityNumber;
    }


    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }


    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }


    public String getHospitalAddress() {
        return hospitalAddress;
    }

    public void setHospitalAddress(
            String hospitalAddress) {

        this.hospitalAddress = hospitalAddress;
    }


    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}