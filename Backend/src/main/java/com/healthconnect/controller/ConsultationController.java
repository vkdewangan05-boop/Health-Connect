package com.healthconnect.controller;

import com.healthconnect.entity.Consultation;
import com.healthconnect.service.ConsultationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
@CrossOrigin(origins = "*")
public class ConsultationController {

    private final ConsultationService service;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public ConsultationController(
            ConsultationService service) {

        this.service = service;
    }


    // =====================================================
    // CREATE CONSULTATION
    // =====================================================

    @PostMapping
    public ResponseEntity<?> createConsultation(
            @RequestBody Consultation consultation) {

        try {

            return ResponseEntity.ok(
                    service.createConsultation(
                            consultation
                    )
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // GET PATIENT CONSULTATIONS
    // =====================================================

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getPatientConsultations(
            @PathVariable Long patientId) {

        try {

            List<Consultation> consultations =
                    service.getPatientConsultations(
                            patientId
                    );

            return ResponseEntity.ok(
                    consultations
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // BACKWARD COMPATIBILITY
    // =====================================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserConsultations(
            @PathVariable Long userId) {

        try {

            return ResponseEntity.ok(
                    service.getPatientConsultations(
                            userId
                    )
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // GET ALL CONSULTATIONS
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getAllConsultations() {

        try {

            return ResponseEntity.ok(
                    service.getAllConsultations()
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // GET DOCTOR CONSULTATIONS
    // =====================================================

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getDoctorConsultations(
            @PathVariable Long doctorId) {

        try {

            return ResponseEntity.ok(
                    service.getDoctorConsultations(
                            doctorId
                    )
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // GET DOCTOR PENDING REQUESTS
    // =====================================================

    @GetMapping("/doctor/{doctorId}/pending")
    public ResponseEntity<?> getDoctorPendingRequests(
            @PathVariable Long doctorId) {

        try {

            return ResponseEntity.ok(
                    service.getDoctorPendingRequests(
                            doctorId
                    )
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // ACCEPT CONSULTATION
    // =====================================================

    @PutMapping("/{consultationId}/accept/{doctorId}")
    public ResponseEntity<?> acceptConsultation(
            @PathVariable Long consultationId,
            @PathVariable Long doctorId) {

        try {

            Consultation accepted =
                    service.acceptConsultation(
                            consultationId,
                            doctorId
                    );

            return ResponseEntity.ok(
                    accepted
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // REJECT CONSULTATION
    // =====================================================

    @PutMapping("/{consultationId}/reject/{doctorId}")
    public ResponseEntity<?> rejectConsultation(
            @PathVariable Long consultationId,
            @PathVariable Long doctorId) {

        try {

            Consultation rejected =
                    service.rejectConsultation(
                            consultationId,
                            doctorId
                    );

            return ResponseEntity.ok(
                    rejected
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // CANCEL CONSULTATION
    // =====================================================

    @PutMapping("/{consultationId}/cancel/{patientId}")
    public ResponseEntity<?> cancelConsultation(
            @PathVariable Long consultationId,
            @PathVariable Long patientId) {

        try {

            Consultation cancelled =
                    service.cancelConsultation(
                            consultationId,
                            patientId
                    );

            return ResponseEntity.ok(
                    cancelled
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // COMPLETE CONSULTATION
    // =====================================================

    @PutMapping("/{consultationId}/complete/{userId}")
    public ResponseEntity<?> completeConsultation(
            @PathVariable Long consultationId,
            @PathVariable Long userId) {

        try {

            Consultation completed =
                    service.completeConsultation(
                            consultationId,
                            userId
                    );

            return ResponseEntity.ok(
                    completed
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // GET CONSULTATION BY ID
    // =====================================================

    @GetMapping("/{consultationId}")
    public ResponseEntity<?> getConsultationById(
            @PathVariable Long consultationId) {

        try {

            return ResponseEntity.ok(
                    service.getConsultationById(
                            consultationId
                    )
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // GET CONSULTATIONS BY STATUS
    // =====================================================

    @GetMapping("/status/{status}")
    public ResponseEntity<?> getConsultationsByStatus(
            @PathVariable String status) {

        try {

            return ResponseEntity.ok(
                    service.getConsultationsByStatus(
                            status
                    )
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}