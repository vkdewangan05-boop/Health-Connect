package com.healthconnect.repository;

import com.healthconnect.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository
        extends JpaRepository<User, Long> {


    // ==========================================
    // LOGIN
    // ==========================================

    Optional<User> findByUsername(
            String username
    );


    Optional<User> findByEmail(
            String email
    );


    // ==========================================
    // DUPLICATE CHECK
    // ==========================================

    boolean existsByUsername(
            String username
    );


    boolean existsByEmail(
            String email
    );


    // ==========================================
    // HOSPITAL PATIENTS
    // ==========================================

    List<User> findByHospitalNameIgnoreCase(
            String hospitalName
    );


    // ==========================================
    // HOSPITAL PATIENTS BY ROLE
    // ==========================================

    List<User> findByHospitalNameIgnoreCaseAndRole(
            String hospitalName,
            String role
    );
}