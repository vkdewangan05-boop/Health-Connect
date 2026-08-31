package com.healthconnect.repository;

import com.healthconnect.entity.CallSession;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface CallSessionRepository
        extends JpaRepository<CallSession, Long> {


    List<CallSession> findByPatientId(Long patientId);


    List<CallSession> findByDoctorId(Long doctorId);


    List<CallSession> findByCallRequestId(Long callRequestId);


    List<CallSession> findByStatus(String status);


    boolean existsByCallRequestIdAndStatus(
            Long callRequestId,
            String status
    );
}