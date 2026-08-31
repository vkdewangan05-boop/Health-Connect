package com.healthconnect.repository;

import com.healthconnect.entity.StudentAdvice;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentRequestRepository
        extends JpaRepository<StudentAdvice, Long> {

    List<StudentAdvice> findByStatus(String status);

    List<StudentAdvice> findByUserId(Long userId);

    List<StudentAdvice> findByStudentId(Long studentId);
}