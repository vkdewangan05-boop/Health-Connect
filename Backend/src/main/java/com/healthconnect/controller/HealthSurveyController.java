package com.healthconnect.controller;

import com.healthconnect.entity.HealthSurvey;
import com.healthconnect.service.HealthSurveyService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health-surveys")
@CrossOrigin(origins = "*")
public class HealthSurveyController {

    private final HealthSurveyService service;

    public HealthSurveyController(HealthSurveyService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<HealthSurvey> saveSurvey(
            @RequestBody HealthSurvey survey) {

        return ResponseEntity.ok(
                service.saveSurvey(survey)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<HealthSurvey>> getUserSurveys(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                service.getUserSurveys(userId)
        );
    }

    @GetMapping
    public ResponseEntity<List<HealthSurvey>> getAllSurveys() {

        return ResponseEntity.ok(
                service.getAllSurveys()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSurvey(
            @PathVariable Long id) {

        service.deleteSurvey(id);

        return ResponseEntity.ok(
                "Health survey deleted successfully."
        );
    }
}