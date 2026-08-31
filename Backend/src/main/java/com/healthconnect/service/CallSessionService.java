package com.healthconnect.service;

import com.healthconnect.entity.CallRequest;
import com.healthconnect.entity.CallSession;
import com.healthconnect.repository.CallRequestRepository;
import com.healthconnect.repository.CallSessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CallSessionService {

    private final CallSessionRepository callSessionRepository;
    private final CallRequestRepository callRequestRepository;

    public CallSessionService(CallSessionRepository callSessionRepository, CallRequestRepository callRequestRepository) {
        this.callSessionRepository = callSessionRepository;
        this.callRequestRepository = callRequestRepository;
    }

    @Transactional
    public CallSession startSession(Long callRequestId) {
        CallRequest request = callRequestRepository.findById(callRequestId)
                .orElseThrow(() -> new RuntimeException("Call request not found with ID: " + callRequestId));

        if (!"ACCEPTED".equalsIgnoreCase(request.getStatus())) {
            throw new RuntimeException("Call request must be ACCEPTED before starting session.");
        }

        // Check if active session already exists
        List<CallSession> existingSessions = callSessionRepository.findByCallRequestId(callRequestId);
        for (CallSession s : existingSessions) {
            if ("ACTIVE".equalsIgnoreCase(s.getStatus())) {
                return s; // Return existing active session to avoid duplicates
            }
        }

        CallSession session = new CallSession();
        session.setCallRequestId(request.getId());
        session.setConsultationId(request.getConsultationId());
        session.setPatientId(request.getPatientId());
        session.setDoctorId(request.getDoctorId());
        session.setCallType(request.getCallType());
        session.setStatus("ACTIVE");
        session.setStartedAt(LocalDateTime.now());

        return callSessionRepository.save(session);
    }

    @Transactional
    public CallSession endSession(Long sessionId) {
        CallSession session = callSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Call session not found with ID: " + sessionId));

        if ("ENDED".equalsIgnoreCase(session.getStatus())) {
            return session;
        }

        session.setStatus("ENDED");
        session.setEndedAt(LocalDateTime.now());
        CallSession savedSession = callSessionRepository.save(session);

        // Sync back to CallRequest
        if (session.getCallRequestId() != null) {
            callRequestRepository.findById(session.getCallRequestId()).ifPresent(req -> {
                req.setStatus("ENDED");
                req.setEndedAt(LocalDateTime.now());
                callRequestRepository.save(req);
            });
        }

        return savedSession;
    }

    public List<CallSession> getSessionsByPatient(Long patientId) {
        return callSessionRepository.findByPatientId(patientId);
    }

    public List<CallSession> getSessionsByDoctor(Long doctorId) {
        return callSessionRepository.findByDoctorId(doctorId);
    }
}