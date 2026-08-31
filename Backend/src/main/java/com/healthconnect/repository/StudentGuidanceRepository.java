package com.healthconnect.repository;

import com.healthconnect.entity.StudentAdvice;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentGuidanceRepository
        extends JpaRepository<StudentAdvice, Long> {

    List<StudentAdvice> findByStudentId(Long studentId);

    List<StudentAdvice> findByUserId(Long userId);

    List<StudentAdvice> findByStatus(String status);
}