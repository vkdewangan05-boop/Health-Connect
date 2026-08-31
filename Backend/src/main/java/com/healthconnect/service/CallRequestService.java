package com.healthconnect.service;

import com.healthconnect.entity.CallRequest;
import com.healthconnect.repository.CallRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CallRequestService {

    private final CallRequestRepository callRequestRepository;

    public CallRequestService(CallRequestRepository callRequestRepository) {
        this.callRequestRepository = callRequestRepository;
    }

    // 1. Create a new Call Request
    public CallRequest createRequest(CallRequest request) {
        if (request.getStatus() == null) {
            request.setStatus("PENDING");
        }
        request.setCreatedAt(LocalDateTime.now());
        return callRequestRepository.save(request);
    }

    // 2. Get Requests for Patient
    public List<CallRequest> getRequestsForPatient(Long patientId) {
        return callRequestRepository.findByPatientId(patientId);
    }

    // 3. Get Pending Requests for Doctor
    public List<CallRequest> getRequestsByDoctor(Long doctorId) {
        return callRequestRepository.findByDoctorId(doctorId);
    }

    // 4. Accept Call Request
    @Transactional
    public CallRequest acceptRequest(Long id, Long doctorId) {
        CallRequest request = callRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Call request not found with ID: " + id));

        if (!request.getDoctorId().equals(doctorId)) {
            throw new RuntimeException("Unauthorized doctor action.");
        }

        request.setStatus("ACCEPTED");
        return callRequestRepository.save(request);
    }

    // 5. Reject Call Request
    @Transactional
    public CallRequest rejectRequest(Long id, Long doctorId) {
        CallRequest request = callRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Call request not found with ID: " + id));

        if (!request.getDoctorId().equals(doctorId)) {
            throw new RuntimeException("Unauthorized doctor action.");
        }

        request.setStatus("REJECTED");
        return callRequestRepository.save(request);
    }
}