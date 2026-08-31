package com.healthconnect.controller;

import com.healthconnect.entity.StudentAdvice;
import com.healthconnect.service.StudentAdviceService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student-advice")
@CrossOrigin(origins = "*")
public class StudentAdviceController {

    private final StudentAdviceService service;

    public StudentAdviceController(
            StudentAdviceService service) {

        this.service = service;
    }

    // Submit advice
    @PostMapping
    public ResponseEntity<StudentAdvice> createAdvice(
            @RequestBody StudentAdvice advice) {

        return ResponseEntity.ok(
                service.createAdvice(advice)
        );
    }

    // Patient's advice
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<StudentAdvice>>
    getUserAdvice(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                service.getUserAdvice(userId)
        );
    }

    // Student's advice
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<StudentAdvice>>
    getStudentAdvice(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                service.getStudentAdvice(studentId)
        );
    }

    // Pending requests
    @GetMapping("/pending")
    public ResponseEntity<List<StudentAdvice>>
    getPendingAdvice() {

        return ResponseEntity.ok(
                service.getPendingAdvice()
        );
    }

    // Update status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String status =
                body.get("status");

        if (status == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Status is required.");
        }

        StudentAdvice updated =
                service.updateStatus(
                        id,
                        status.toUpperCase()
                );

        if (updated == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(updated);
    }
}