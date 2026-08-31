package com.healthconnect.controller;

import com.healthconnect.entity.MedicalRecord;
import com.healthconnect.service.MedicalRecordService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/medical-records")
@CrossOrigin(origins = "*")
public class MedicalRecordController {


    private final MedicalRecordService medicalRecordService;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public MedicalRecordController(
            MedicalRecordService medicalRecordService) {

        this.medicalRecordService =
                medicalRecordService;
    }


    // ==========================================
    // CREATE MEDICAL RECORD
    // ==========================================

    @PostMapping
    public ResponseEntity<?> createRecord(
            @RequestBody MedicalRecord record) {

        try {

            MedicalRecord savedRecord =
                    medicalRecordService
                            .addRecord(record);


            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedRecord);

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }

    }


    // ==========================================
    // GET ALL MEDICAL RECORDS
    // ==========================================

    @GetMapping
    public ResponseEntity<?> getAllRecords() {

        try {

            List<MedicalRecord> records =
                    medicalRecordService
                            .getAllRecords();


            return ResponseEntity.ok(
                    records
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }

    }


    // ==========================================
    // GET MEDICAL RECORD BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getRecordById(
            @PathVariable Long id) {

        try {

            MedicalRecord record =
                    medicalRecordService
                            .getRecordById(id);


            return ResponseEntity.ok(
                    record
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }

    }


    // ==========================================
    // GET USER MEDICAL RECORDS
    // ==========================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserRecords(
            @PathVariable Long userId) {

        try {

            List<MedicalRecord> records =
                    medicalRecordService
                            .getUserRecords(userId);


            return ResponseEntity.ok(
                    records
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }

    }


    // ==========================================
    // DELETE MEDICAL RECORD
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecord(
            @PathVariable Long id) {

        try {

            medicalRecordService
                    .deleteRecord(id);


            return ResponseEntity.ok(
                    "Medical record deleted successfully."
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }

    }

}