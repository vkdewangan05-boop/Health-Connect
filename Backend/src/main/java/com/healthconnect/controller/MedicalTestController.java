package com.healthconnect.controller;

import com.healthconnect.entity.MedicalTest;
import com.healthconnect.service.MedicalTestService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-tests")
@CrossOrigin(origins = "*")
public class MedicalTestController {


    private final MedicalTestService service;


    public MedicalTestController(
            MedicalTestService service) {

        this.service = service;
    }


    // ==========================================
    // CREATE
    // ==========================================

    @PostMapping
    public ResponseEntity<?> createTest(
            @RequestBody MedicalTest test) {

        try {

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            service.createTest(test)
                    );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // ==========================================
    // GET ALL
    // ==========================================

    @GetMapping
    public ResponseEntity<List<MedicalTest>>
    getAllTests() {

        return ResponseEntity.ok(
                service.getAllTests()
        );
    }


    // ==========================================
    // GET BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<MedicalTest>
    getTestById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getTestById(id)
        );
    }


    // ==========================================
    // HOSPITAL TESTS
    // ==========================================

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<MedicalTest>>
    getHospitalTests(
            @PathVariable Long hospitalId) {

        return ResponseEntity.ok(
                service.getHospitalTests(
                        hospitalId
                )
        );
    }


    // ==========================================
    // AVAILABLE HOSPITAL TESTS
    // ==========================================

    @GetMapping("/hospital/{hospitalId}/available")
    public ResponseEntity<List<MedicalTest>>
    getAvailableHospitalTests(
            @PathVariable Long hospitalId) {

        return ResponseEntity.ok(
                service.getAvailableHospitalTests(
                        hospitalId
                )
        );
    }


    // ==========================================
    // UPDATE
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<MedicalTest>
    updateTest(
            @PathVariable Long id,
            @RequestBody MedicalTest test) {

        return ResponseEntity.ok(
                service.updateTest(
                        id,
                        test
                )
        );
    }


    // ==========================================
    // DELETE
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String>
    deleteTest(
            @PathVariable Long id) {

        service.deleteTest(id);

        return ResponseEntity.ok(
                "Medical test deleted successfully."
        );
    }
}