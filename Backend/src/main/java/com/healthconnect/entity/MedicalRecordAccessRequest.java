package com.healthconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "medical_record_access_requests")
public class MedicalRecordAccessRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long consultationId;

    private Long userId;

    private Long doctorId;

    private String status;

    public MedicalRecordAccessRequest() {
    }

    public MedicalRecordAccessRequest(
            Long id,
            Long consultationId,
            Long userId,
            Long doctorId,
            String status) {

        this.id = id;
        this.consultationId = consultationId;
        this.userId = userId;
        this.doctorId = doctorId;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getConsultationId() {
        return consultationId;
    }

    public void setConsultationId(Long consultationId) {
        this.consultationId = consultationId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}