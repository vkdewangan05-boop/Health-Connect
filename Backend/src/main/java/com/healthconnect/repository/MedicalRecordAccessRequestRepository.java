package com.healthconnect.repository;

import com.healthconnect.entity.MedicalRecordAccessRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MedicalRecordAccessRequestRepository
        extends JpaRepository<MedicalRecordAccessRequest, Long> {

    List<MedicalRecordAccessRequest> findByUserId(Long userId);

    List<MedicalRecordAccessRequest> findByDoctorId(Long doctorId);

    Optional<MedicalRecordAccessRequest>
    findByConsultationId(Long consultationId);

    Optional<MedicalRecordAccessRequest>
    findByConsultationIdAndDoctorIdAndUserId(
            Long consultationId,
            Long doctorId,
            Long userId
    );
}