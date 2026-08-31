package com.healthconnect.controller;

import com.healthconnect.entity.Prescription;
import com.healthconnect.service.PrescriptionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "*")
public class PrescriptionController {

    private final PrescriptionService service;

    public PrescriptionController(PrescriptionService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Prescription> createPrescription(
            @RequestBody Prescription prescription) {

        return ResponseEntity.ok(
                service.createPrescription(prescription)
        );
    }

    @GetMapping
    public ResponseEntity<List<Prescription>>
    getAllPrescriptions() {

        return ResponseEntity.ok(
                service.getAllPrescriptions()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prescription>
    getPrescriptionById(@PathVariable Long id) {

        return ResponseEntity.ok(
                service.getPrescriptionById(id)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Prescription>>
    getUserPrescriptions(@PathVariable Long userId) {

        return ResponseEntity.ok(
                service.getUserPrescriptions(userId)
        );
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Prescription>>
    getDoctorPrescriptions(@PathVariable Long doctorId) {

        return ResponseEntity.ok(
                service.getDoctorPrescriptions(doctorId)
        );
    }

    @GetMapping("/consultation/{consultationId}")
    public ResponseEntity<List<Prescription>>
    getConsultationPrescriptions(
            @PathVariable Long consultationId) {

        return ResponseEntity.ok(
                service.getConsultationPrescriptions(
                        consultationId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prescription>
    updatePrescription(
            @PathVariable Long id,
            @RequestBody Prescription prescription) {

        return ResponseEntity.ok(
                service.updatePrescription(id, prescription)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePrescription(
            @PathVariable Long id) {

        service.deletePrescription(id);

        return ResponseEntity.ok(
                "Prescription deleted successfully."
        );
    }
}