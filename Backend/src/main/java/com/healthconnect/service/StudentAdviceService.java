package com.healthconnect.service;

import com.healthconnect.entity.StudentAdvice;
import com.healthconnect.repository.StudentAdviceRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentAdviceService {

    private final StudentAdviceRepository repository;

    public StudentAdviceService(
            StudentAdviceRepository repository) {

        this.repository = repository;
    }

    public StudentAdvice createAdvice(
            StudentAdvice advice) {

        if (advice.getStatus() == null ||
                advice.getStatus().trim().isEmpty()) {

            advice.setStatus("SUBMITTED");
        }

        return repository.save(advice);
    }

    public List<StudentAdvice> getUserAdvice(
            Long userId) {

        return repository.findByUserId(userId);
    }

    public List<StudentAdvice> getStudentAdvice(
            Long studentId) {

        return repository.findByStudentId(studentId);
    }

    public List<StudentAdvice> getPendingAdvice() {

        return repository.findByStatus("PENDING");
    }

    public StudentAdvice updateStatus(
            Long id,
            String status) {

        StudentAdvice advice =
                repository.findById(id).orElse(null);

        if (advice == null) {
            return null;
        }

        advice.setStatus(status);

        return repository.save(advice);
    }
}