package com.healthconnect.repository;

import com.healthconnect.entity.TestBooking;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestBookingRepository
        extends JpaRepository<TestBooking, Long> {

    List<TestBooking> findByUserId(
            Long userId
    );

    List<TestBooking> findByHospitalId(
            Long hospitalId
    );

    List<TestBooking> findByMedicalTestId(
            Long medicalTestId
    );

    List<TestBooking> findByStatusIgnoreCase(
            String status
    );
}