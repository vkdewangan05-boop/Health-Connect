package com.healthconnect.controller;

import com.healthconnect.entity.Student;
import com.healthconnect.service.StudentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService service;

    public StudentController(StudentService service) {
        this.service = service;
    }

    // Register student
    @PostMapping("/register")
    public ResponseEntity<?> registerStudent(
            @RequestBody Student student) {

        try {

            return ResponseEntity.ok(
                    service.registerStudent(student)
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // Student login
    @PostMapping("/login")
    public ResponseEntity<?> loginStudent(
            @RequestBody Map<String, String> loginData) {

        String username =
                loginData.get("username");

        String password =
                loginData.get("password");

        Student student =
                service.loginStudent(
                        username,
                        password
                );

        if (student == null) {

            return ResponseEntity
                    .status(401)
                    .body("Invalid username or password.");
        }

        return ResponseEntity.ok(student);
    }

    // All students
    @GetMapping
    public ResponseEntity<List<Student>>
    getAllStudents() {

        return ResponseEntity.ok(
                service.getAllStudents()
        );
    }

    // Available students
    @GetMapping("/available")
    public ResponseEntity<List<Student>>
    getAvailableStudents() {

        return ResponseEntity.ok(
                service.getAvailableStudents()
        );
    }

    // Student by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentById(
            @PathVariable Long id) {

        Student student =
                service.getStudentById(id);

        if (student == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(student);
    }

    // Update availability
    @PutMapping("/{id}/availability")
    public ResponseEntity<?> updateAvailability(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {

        Boolean available =
                body.get("available");

        Student student =
                service.updateAvailability(
                        id,
                        available
                );

        if (student == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(student);
    }
}