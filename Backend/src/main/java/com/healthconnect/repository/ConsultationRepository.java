package com.healthconnect.repository;

import com.healthconnect.entity.Consultation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultationRepository
        extends JpaRepository<Consultation, Long> {

    // ==========================================
    // PATIENT CONSULTATIONS
    // ==========================================

    List<Consultation> findByPatientId(Long patientId);


    // ==========================================
    // DOCTOR CONSULTATIONS
    // ==========================================

    List<Consultation> findByDoctorId(Long doctorId);


    // ==========================================
    // DOCTOR PENDING REQUESTS
    // ==========================================

    List<Consultation> findByDoctorIdAndStatus(
            Long doctorId,
            String status
    );


    // ==========================================
    // PATIENT PENDING REQUESTS
    // ==========================================

    List<Consultation> findByPatientIdAndStatus(
            Long patientId,
            String status
    );


    // ==========================================
    // CONSULTATIONS BY STATUS
    // ==========================================

    List<Consultation> findByStatus(String status);


    // ==========================================
    // PATIENT + STATUS IGNORE CASE
    // ==========================================

    List<Consultation> findByPatientIdAndStatusIgnoreCase(
            Long patientId,
            String status
    );


    // ==========================================
    // DOCTOR + STATUS IGNORE CASE
    // ==========================================

    List<Consultation> findByDoctorIdAndStatusIgnoreCase(
            Long doctorId,
            String status
    );


    // ==========================================
    // DUPLICATE PENDING REQUEST CHECK
    // ==========================================

    boolean existsByPatientIdAndDoctorIdAndStatus(
            Long patientId,
            Long doctorId,
            String status
    );
}