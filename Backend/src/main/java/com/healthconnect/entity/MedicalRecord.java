package com.healthconnect.entity;

import jakarta.persistence.*;

import java.time.LocalDate;


@Entity
@Table(name = "medical_records")
public class MedicalRecord {


    // ==========================================
    // ID
    // ==========================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // ==========================================
    // USER ID
    // ==========================================

    private Long userId;


    // ==========================================
    // CONSULTATION ID
    // ==========================================

    @Column(name = "consultation_id")
    private Long consultationId;


    // ==========================================
    // DOCTOR NAME
    // ==========================================

    private String doctorName;


    // ==========================================
    // HOSPITAL NAME
    // ==========================================

    private String hospitalName;


    // ==========================================
    // DEPARTMENT
    // ==========================================

    private String department;


    // ==========================================
    // DIAGNOSIS
    // ==========================================

    private String diagnosis;


    // ==========================================
    // RECORD DATE
    // ==========================================

    private LocalDate recordDate;


    // ==========================================
    // STATUS
    // ==========================================

    private String status;


    // ==========================================
    // DEFAULT CONSTRUCTOR
    // ==========================================

    public MedicalRecord() {
    }


    // ==========================================
    // GETTERS AND SETTERS
    // ==========================================

    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public Long getUserId() {
        return userId;
    }


    public void setUserId(Long userId) {
        this.userId = userId;
    }


    public Long getConsultationId() {
        return consultationId;
    }


    public void setConsultationId(Long consultationId) {
        this.consultationId = consultationId;
    }


    public String getDoctorName() {
        return doctorName;
    }


    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }


    public String getHospitalName() {
        return hospitalName;
    }


    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }


    public String getDepartment() {
        return department;
    }


    public void setDepartment(String department) {
        this.department = department;
    }


    public String getDiagnosis() {
        return diagnosis;
    }


    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }


    public LocalDate getRecordDate() {
        return recordDate;
    }


    public void setRecordDate(LocalDate recordDate) {
        this.recordDate = recordDate;
    }


    public String getStatus() {
        return status;
    }


    public void setStatus(String status) {
        this.status = status;
    }

}