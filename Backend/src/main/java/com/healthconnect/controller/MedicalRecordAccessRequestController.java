package com.healthconnect.controller;

import com.healthconnect.entity.MedicalRecordAccessRequest;
import com.healthconnect.service.MedicalRecordAccessRequestService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medical-record-access")
@CrossOrigin(origins = "*")
public class MedicalRecordAccessRequestController {

    private final MedicalRecordAccessRequestService service;

    public MedicalRecordAccessRequestController(
            MedicalRecordAccessRequestService service) {

        this.service = service;
    }

    // Doctor creates access request
    @PostMapping
    public ResponseEntity<MedicalRecordAccessRequest> createRequest(
            @RequestBody MedicalRecordAccessRequest request) {

        return ResponseEntity.ok(
                service.createRequest(request)
        );
    }

    // Patient gets his/her requests
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MedicalRecordAccessRequest>>
    getUserRequests(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                service.getRequestsByUserId(userId)
        );
    }

    // Doctor gets his requests
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<MedicalRecordAccessRequest>>
    getDoctorRequests(
            @PathVariable Long doctorId) {

        return ResponseEntity.ok(
                service.getRequestsByDoctorId(doctorId)
        );
    }

    // Patient approves/denies request
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String status = body.get("status");

        if (status == null ||
                (
                    !status.equalsIgnoreCase("APPROVED") &&
                    !status.equalsIgnoreCase("DENIED")
                )) {

            return ResponseEntity.badRequest().body(
                    "Status must be APPROVED or DENIED."
            );
        }

        MedicalRecordAccessRequest updated =
                service.updateStatus(id, status.toUpperCase());

        if (updated == null) {

            return ResponseEntity.notFound().build();

        }

        return ResponseEntity.ok(updated);
    }

    // Check access
    @GetMapping("/check")
    public ResponseEntity<Boolean> checkAccess(
            @RequestParam Long consultationId,
            @RequestParam Long doctorId,
            @RequestParam Long userId) {

        return ResponseEntity.ok(
                service.hasApprovedAccess(
                        consultationId,
                        doctorId,
                        userId
                )
        );
    }
}