package com.healthconnect.repository;

import com.healthconnect.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionRepository
        extends JpaRepository<Prescription, Long> {

    List<Prescription> findByUserId(Long userId);

    List<Prescription> findByDoctorId(Long doctorId);

    List<Prescription> findByConsultationId(Long consultationId);
}