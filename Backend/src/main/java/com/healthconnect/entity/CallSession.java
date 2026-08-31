package com.healthconnect.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "call_sessions")
public class CallSession {


    // ==========================================
    // ID
    // ==========================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // ==========================================
    // CALL REQUEST
    // ==========================================

    @Column(nullable = false)
    private Long callRequestId;


    // ==========================================
    // CONSULTATION
    // ==========================================

    @Column(nullable = false)
    private Long consultationId;


    // ==========================================
    // PATIENT
    // ==========================================

    @Column(nullable = false)
    private Long patientId;

    private String patientUsername;


    // ==========================================
    // DOCTOR
    // ==========================================

    @Column(nullable = false)
    private Long doctorId;

    private String doctorUsername;


    // ==========================================
    // CALL TYPE
    // ==========================================

    @Column(nullable = false)
    private String callType;


    // ==========================================
    // SESSION STATUS
    // ==========================================

    @Column(nullable = false)
    private String status;


    // ==========================================
    // START TIME
    // ==========================================

    @Column(nullable = false)
    private LocalDateTime startedAt;


    // ==========================================
    // END TIME
    // ==========================================

    private LocalDateTime endedAt;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public CallSession() {

        this.status = "ACTIVE";
        this.startedAt = LocalDateTime.now();
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


    public Long getCallRequestId() {

        return callRequestId;
    }


    public void setCallRequestId(Long callRequestId) {

        this.callRequestId = callRequestId;
    }


    public Long getConsultationId() {

        return consultationId;
    }


    public void setConsultationId(Long consultationId) {

        this.consultationId = consultationId;
    }


    public Long getPatientId() {

        return patientId;
    }


    public void setPatientId(Long patientId) {

        this.patientId = patientId;
    }


    public String getPatientUsername() {

        return patientUsername;
    }


    public void setPatientUsername(String patientUsername) {

        this.patientUsername = patientUsername;
    }


    public Long getDoctorId() {

        return doctorId;
    }


    public void setDoctorId(Long doctorId) {

        this.doctorId = doctorId;
    }


    public String getDoctorUsername() {

        return doctorUsername;
    }


    public void setDoctorUsername(String doctorUsername) {

        this.doctorUsername = doctorUsername;
    }


    public String getCallType() {

        return callType;
    }


    public void setCallType(String callType) {

        this.callType = callType;
    }


    public String getStatus() {

        return status;
    }


    public void setStatus(String status) {

        this.status = status;
    }


    public LocalDateTime getStartedAt() {

        return startedAt;
    }


    public void setStartedAt(LocalDateTime startedAt) {

        this.startedAt = startedAt;
    }


    public LocalDateTime getEndedAt() {

        return endedAt;
    }


    public void setEndedAt(LocalDateTime endedAt) {

        this.endedAt = endedAt;
    }
}