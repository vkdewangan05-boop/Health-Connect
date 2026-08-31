package com.healthconnect.controller;

import com.healthconnect.entity.StudentAdvice;
import com.healthconnect.service.StudentGuidanceService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-guidance")
@CrossOrigin(origins = "*")
public class StudentGuidanceController {

    private final StudentGuidanceService service;

    public StudentGuidanceController(
            StudentGuidanceService service) {

        this.service = service;
    }

    // Get all pending patient guidance requests
    @GetMapping("/pending")
    public ResponseEntity<List<StudentAdvice>> getPendingRequests() {

        return ResponseEntity.ok(
                service.getPendingRequests()
        );
    }

    // Get guidance records for a student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<StudentAdvice>> getStudentGuidance(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                service.getStudentGuidance(studentId)
        );
    }

    // Get guidance records for a patient
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<StudentAdvice>> getUserGuidance(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                service.getUserGuidance(userId)
        );
    }

    // Submit guidance
    @PostMapping
    public ResponseEntity<StudentAdvice> submitGuidance(
            @RequestBody StudentAdvice advice) {

        return ResponseEntity.ok(
                service.submitGuidance(advice)
        );
    }
}