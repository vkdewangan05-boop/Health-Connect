package com.healthconnect.controller;

import com.healthconnect.entity.StudentAdvice;
import com.healthconnect.service.StudentRequestService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-requests")
@CrossOrigin(origins = "*")
public class StudentRequestController {

    private final StudentRequestService service;

    public StudentRequestController(
            StudentRequestService service) {

        this.service = service;
    }

    // All pending requests
    @GetMapping("/pending")
    public ResponseEntity<List<StudentAdvice>>
    getPendingRequests() {

        return ResponseEntity.ok(
                service.getPendingRequests()
        );
    }

    // Requests of a specific patient
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<StudentAdvice>>
    getUserRequests(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                service.getUserRequests(userId)
        );
    }

    // Requests handled by a student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<StudentAdvice>>
    getStudentRequests(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                service.getStudentRequests(studentId)
        );
    }
}