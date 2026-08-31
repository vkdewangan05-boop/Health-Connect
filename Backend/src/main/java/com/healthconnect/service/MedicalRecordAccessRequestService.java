package com.healthconnect.service;

import com.healthconnect.entity.MedicalRecordAccessRequest;
import com.healthconnect.repository.MedicalRecordAccessRequestRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicalRecordAccessRequestService {

    private final MedicalRecordAccessRequestRepository repository;

    public MedicalRecordAccessRequestService(
            MedicalRecordAccessRequestRepository repository) {

        this.repository = repository;
    }

    // Create access request
    public MedicalRecordAccessRequest createRequest(
            MedicalRecordAccessRequest request) {

        if (request.getStatus() == null ||
                request.getStatus().trim().isEmpty()) {

            request.setStatus("PENDING");
        }

        return repository.save(request);
    }

    // Patient: get all requests
    public List<MedicalRecordAccessRequest> getRequestsByUserId(
            Long userId) {

        return repository.findByUserId(userId);
    }

    // Doctor: get all requests created by doctor
    public List<MedicalRecordAccessRequest> getRequestsByDoctorId(
            Long doctorId) {

        return repository.findByDoctorId(doctorId);
    }

    // Get request by ID
    public MedicalRecordAccessRequest getRequestById(Long id) {

        return repository.findById(id).orElse(null);
    }

    // Update request status
    public MedicalRecordAccessRequest updateStatus(
            Long id,
            String status) {

        MedicalRecordAccessRequest request =
                repository.findById(id).orElse(null);

        if (request == null) {
            return null;
        }

        request.setStatus(status);

        return repository.save(request);
    }

    // Check whether doctor has access
    public boolean hasApprovedAccess(
            Long consultationId,
            Long doctorId,
            Long userId) {

        return repository
                .findByConsultationIdAndDoctorIdAndUserId(
                        consultationId,
                        doctorId,
                        userId
                )
                .map(request ->
                        "APPROVED".equalsIgnoreCase(
                                request.getStatus()
                        )
                )
                .orElse(false);
    }
}