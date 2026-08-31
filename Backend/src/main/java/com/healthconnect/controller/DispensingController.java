package com.healthconnect.controller;

import com.healthconnect.entity.Dispensing;
import com.healthconnect.service.DispensingService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dispensing")
@CrossOrigin(origins = "*")
public class DispensingController {

    private final DispensingService service;

    public DispensingController(
            DispensingService service) {

        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> dispenseMedicine(
            @RequestBody Dispensing dispensing) {

        try {

            return ResponseEntity.ok(
                    service.dispenseMedicine(dispensing)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Dispensing>>
    getAllDispensing() {

        return ResponseEntity.ok(
                service.getAllDispensing()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dispensing>
    getDispensingById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getDispensingById(id)
        );
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<Dispensing>>
    getHospitalDispensing(
            @PathVariable Long hospitalId) {

        return ResponseEntity.ok(
                service.getHospitalDispensing(hospitalId)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Dispensing>>
    getUserDispensing(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                service.getUserDispensing(userId)
        );
    }

    @GetMapping("/prescription/{prescriptionId}")
    public ResponseEntity<List<Dispensing>>
    getPrescriptionDispensing(
            @PathVariable Long prescriptionId) {

        return ResponseEntity.ok(
                service.getPrescriptionDispensing(
                        prescriptionId)
        );
    }
}