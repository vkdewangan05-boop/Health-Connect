package com.healthconnect.repository;

import com.healthconnect.entity.MedicalTest;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicalTestRepository
        extends JpaRepository<MedicalTest, Long> {

    List<MedicalTest> findByHospitalId(
            Long hospitalId
    );

    List<MedicalTest> findByHospitalIdAndAvailable(
            Long hospitalId,
            Boolean available
    );
}