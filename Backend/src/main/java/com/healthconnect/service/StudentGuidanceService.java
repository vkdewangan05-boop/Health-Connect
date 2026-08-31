package com.healthconnect.service;

import com.healthconnect.entity.StudentAdvice;
import com.healthconnect.repository.StudentGuidanceRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentGuidanceService {

    private final StudentGuidanceRepository repository;

    public StudentGuidanceService(
            StudentGuidanceRepository repository) {

        this.repository = repository;
    }

    public List<StudentAdvice> getPendingRequests() {

        return repository.findByStatus("PENDING");
    }

    public List<StudentAdvice> getStudentGuidance(
            Long studentId) {

        return repository.findByStudentId(studentId);
    }

    public List<StudentAdvice> getUserGuidance(
            Long userId) {

        return repository.findByUserId(userId);
    }

    public StudentAdvice submitGuidance(
            StudentAdvice advice) {

        if (advice.getStatus() == null ||
                advice.getStatus().trim().isEmpty()) {

            advice.setStatus("SUBMITTED");
        }

        return repository.save(advice);
    }
}