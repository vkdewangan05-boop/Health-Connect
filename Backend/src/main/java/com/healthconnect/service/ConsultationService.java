package com.healthconnect.service;

import com.healthconnect.entity.Appointment;
import com.healthconnect.entity.Consultation;
import com.healthconnect.entity.Doctor;
import com.healthconnect.entity.User;

import com.healthconnect.repository.AppointmentRepository;
import com.healthconnect.repository.ConsultationRepository;
import com.healthconnect.repository.DoctorRepository;
import com.healthconnect.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public ConsultationService(
            ConsultationRepository consultationRepository,
            UserRepository userRepository,
            DoctorRepository doctorRepository,
            AppointmentRepository appointmentRepository) {

        this.consultationRepository = consultationRepository;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public Consultation createConsultation(Consultation consultation) {
        if (consultation == null) {
            throw new IllegalArgumentException("Consultation must not be null.");
        }

        Long patientId = consultation.getPatientId();
        if (patientId == null) {
            throw new IllegalArgumentException("Patient ID is required.");
        }

        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient with ID " + patientId + " was not found."));

        String patientRole = patient.getRole();
        if (patientRole != null && !patientRole.equalsIgnoreCase("USER") && !patientRole.equalsIgnoreCase("PATIENT")) {
            throw new IllegalArgumentException("Only patients can create consultations.");
        }

        Long doctorId = consultation.getDoctorId();
        if (doctorId == null) {
            throw new IllegalArgumentException("Doctor ID is required.");
        }

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor with ID " + doctorId + " was not found."));

        String doctorStatus = doctor.getStatus();
        if (doctorStatus != null && !doctorStatus.equalsIgnoreCase("APPROVED")) {
            throw new IllegalArgumentException("Doctor is not approved for consultations.");
        }

        Boolean doctorAvailable = doctor.getAvailable();
        if (doctorAvailable != null && !doctorAvailable) {
            throw new IllegalArgumentException("Doctor is currently unavailable.");
        }

        String reason = consultation.getReason();
        if (reason == null || reason.trim().isEmpty()) {
            throw new IllegalArgumentException("Consultation reason is required.");
        }
        reason = reason.trim();
        if (reason.length() > 1000) {
            throw new IllegalArgumentException("Consultation reason cannot exceed 1000 characters.");
        }

        boolean pendingExists = consultationRepository.existsByPatientIdAndDoctorIdAndStatus(patientId, doctorId, "PENDING");
        if (pendingExists) {
            throw new IllegalArgumentException("A pending consultation request already exists for this doctor.");
        }

        String patientUsername = patient.getUsername() != null && !patient.getUsername().trim().isEmpty() ? patient.getUsername() : patient.getFullName();
        consultation.setPatientUsername(patientUsername);

        String doctorUsername = doctor.getUsername() != null && !doctor.getUsername().trim().isEmpty() ? doctor.getUsername() : doctor.getFullName();
        consultation.setDoctorUsername(doctorUsername);

        consultation.setReason(reason);
        consultation.setStatus("PENDING");
        consultation.setCreatedAt(LocalDateTime.now());
        consultation.setAcceptedAt(null);
        consultation.setRejectedAt(null);
        consultation.setCancelledAt(null);
        consultation.setCompletedAt(null);

        Consultation savedConsultation = consultationRepository.save(consultation);

        // =====================================================
        // AUTO-SYNC TO APPOINTMENTS TABLE FOR UI PRESERVATION
        // =====================================================
        Appointment appointment = new Appointment();
        appointment.setUserId(patientId);
        appointment.setDoctorId(doctorId);
        appointment.setReason(reason);
        appointment.setType("ONLINE_CONSULTATION");
        appointment.setStatus("PENDING");
        appointment.setAppointmentDate(LocalDateTime.now().toLocalDate().toString());
        appointment.setAppointmentTime(LocalDateTime.now().toLocalTime().toString());
        appointmentRepository.save(appointment);

        return savedConsultation;
    }

    public List<Consultation> getAllConsultations() {
        return consultationRepository.findAll();
    }

    public List<Consultation> getPatientConsultations(Long patientId) {
        if (patientId == null) {
            throw new IllegalArgumentException("Patient ID is required.");
        }
        if (!userRepository.existsById(patientId)) {
            throw new IllegalArgumentException("Patient with ID " + patientId + " was not found.");
        }
        return consultationRepository.findByPatientId(patientId);
    }

    public List<Consultation> getDoctorConsultations(Long doctorId) {
        if (doctorId == null) {
            throw new IllegalArgumentException("Doctor ID is required.");
        }
        if (!doctorRepository.existsById(doctorId)) {
            throw new IllegalArgumentException("Doctor with ID " + doctorId + " was not found.");
        }
        return consultationRepository.findByDoctorId(doctorId);
    }

    public List<Consultation> getDoctorPendingRequests(Long doctorId) {
        if (doctorId == null) {
            throw new IllegalArgumentException("Doctor ID is required.");
        }
        if (!doctorRepository.existsById(doctorId)) {
            throw new IllegalArgumentException("Doctor with ID " + doctorId + " was not found.");
        }
        return consultationRepository.findByDoctorIdAndStatusIgnoreCase(doctorId, "PENDING");
    }

    public Consultation acceptConsultation(Long consultationId, Long doctorId) {
        if (consultationId == null || doctorId == null) {
            throw new IllegalArgumentException("IDs are required.");
        }
        if (!doctorRepository.existsById(doctorId)) {
            throw new IllegalArgumentException("Doctor not found.");
        }

        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new IllegalArgumentException("Consultation not found."));

        if (!doctorId.equals(consultation.getDoctorId())) {
            throw new IllegalArgumentException("Unauthorized action.");
        }

        if (!"PENDING".equalsIgnoreCase(consultation.getStatus())) {
            throw new IllegalArgumentException("Only pending consultations can be accepted.");
        }

        consultation.setStatus("ACCEPTED");
        consultation.setAcceptedAt(LocalDateTime.now());
        return consultationRepository.save(consultation);
    }

    public Consultation rejectConsultation(Long consultationId, Long doctorId) {
        if (consultationId == null || doctorId == null) {
            throw new IllegalArgumentException("IDs are required.");
        }
        if (!doctorRepository.existsById(doctorId)) {
            throw new IllegalArgumentException("Doctor not found.");
        }

        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new IllegalArgumentException("Consultation not found."));

        if (!doctorId.equals(consultation.getDoctorId())) {
            throw new IllegalArgumentException("Unauthorized action.");
        }

        if (!"PENDING".equalsIgnoreCase(consultation.getStatus())) {
            throw new IllegalArgumentException("Only pending consultations can be rejected.");
        }

        consultation.setStatus("REJECTED");
        consultation.setRejectedAt(LocalDateTime.now());
        return consultationRepository.save(consultation);
    }

    public Consultation cancelConsultation(Long consultationId, Long patientId) {
        if (consultationId == null || patientId == null) {
            throw new IllegalArgumentException("IDs are required.");
        }
        if (!userRepository.existsById(patientId)) {
            throw new IllegalArgumentException("Patient not found.");
        }

        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new IllegalArgumentException("Consultation not found."));

        if (!patientId.equals(consultation.getPatientId())) {
            throw new IllegalArgumentException("Unauthorized action.");
        }

        if (!"PENDING".equalsIgnoreCase(consultation.getStatus())) {
            throw new IllegalArgumentException("Only pending consultations can be cancelled.");
        }

        consultation.setStatus("CANCELLED");
        consultation.setCancelledAt(LocalDateTime.now());
        return consultationRepository.save(consultation);
    }

    public Consultation completeConsultation(Long consultationId, Long userId) {
        if (consultationId == null || userId == null) {
            throw new IllegalArgumentException("IDs are required.");
        }

        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new IllegalArgumentException("Consultation not found."));

        boolean isPatient = userId.equals(consultation.getPatientId());
        boolean isDoctor = userId.equals(consultation.getDoctorId());

        if (!isPatient && !isDoctor) {
            throw new IllegalArgumentException("Unauthorized action.");
        }

        if (!"ACCEPTED".equalsIgnoreCase(consultation.getStatus())) {
            throw new IllegalArgumentException("Only accepted consultations can be completed.");
        }

        consultation.setStatus("COMPLETED");
        consultation.setCompletedAt(LocalDateTime.now());
        return consultationRepository.save(consultation);
    }

    public Consultation getConsultationById(Long consultationId) {
        if (consultationId == null) {
            throw new IllegalArgumentException("Consultation ID is required.");
        }
        return consultationRepository.findById(consultationId)
                .orElseThrow(() -> new IllegalArgumentException("Consultation not found."));
    }

    public List<Consultation> getConsultationsByStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status is required.");
        }
        return consultationRepository.findByStatus(status.trim().toUpperCase());
    }

    public void deleteConsultation(Long consultationId) {
        if (consultationId == null || !consultationRepository.existsById(consultationId)) {
            throw new IllegalArgumentException("Consultation not found.");
        }
        consultationRepository.deleteById(consultationId);
    }
}