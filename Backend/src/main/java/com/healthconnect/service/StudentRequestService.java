package com.healthconnect.service;

import com.healthconnect.entity.StudentAdvice;
import com.healthconnect.repository.StudentRequestRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentRequestService {

    private final StudentRequestRepository repository;

    public StudentRequestService(
            StudentRequestRepository repository) {

        this.repository = repository;
    }

    public List<StudentAdvice> getPendingRequests() {

        return repository.findByStatus("PENDING");
    }

    public List<StudentAdvice> getUserRequests(
           Long userId) {

        return repository.findByUserId(userId);
    }

    public List<StudentAdvice> getStudentRequests(
            Long studentId) {

        return repository.findByStudentId(studentId);
    }
}