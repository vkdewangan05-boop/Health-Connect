package com.healthconnect.repository;

import com.healthconnect.entity.Doctor;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository
        extends JpaRepository<Doctor, Long> {

    // =====================================================
    // LOGIN
    // =====================================================

    Optional<Doctor> findByUsername(String username);


    // =====================================================
    // DUPLICATE CHECKS
    // =====================================================

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByDoctorIdentityNumber(
            String doctorIdentityNumber
    );


    // =====================================================
    // DOCTOR TYPE
    // =====================================================

    List<Doctor> findByDoctorType(
            String doctorType
    );


    List<Doctor> findByDoctorTypeAndAvailable(
            String doctorType,
            Boolean available
    );


    // =====================================================
    // HOSPITAL
    // =====================================================

    List<Doctor> findByHospitalNameIgnoreCase(
            String hospitalName
    );


    List<Doctor> findByHospitalNameIgnoreCaseAndAvailable(
            String hospitalName,
            Boolean available
    );


    // =====================================================
    // LOCATION
    // =====================================================

    List<Doctor> findByLocationContainingIgnoreCase(
            String location
    );


    // =====================================================
    // SEARCH BY NAME
    // =====================================================

    List<Doctor> findByFullNameContainingIgnoreCaseOrderByFullNameAsc(
            String fullName
    );


    // =====================================================
    // SEARCH BY SPECIALIZATION
    // =====================================================

    List<Doctor> findBySpecializationContainingIgnoreCaseOrderByFullNameAsc(
            String specialization
    );


    // =====================================================
    // SEARCH BY DOCTOR IDENTITY NUMBER
    // =====================================================

    Optional<Doctor> findByDoctorIdentityNumber(
            String doctorIdentityNumber
    );
}