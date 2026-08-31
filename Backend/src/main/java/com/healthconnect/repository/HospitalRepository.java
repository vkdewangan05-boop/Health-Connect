package com.healthconnect.repository;

import com.healthconnect.entity.Hospital;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HospitalRepository
        extends JpaRepository<Hospital, Long> {


    List<Hospital> findByLocationIgnoreCase(
            String location
    );


    List<Hospital> findByLocationContainingIgnoreCase(
            String location
    );


    List<Hospital> findByTypeIgnoreCase(
            String type
    );


    List<Hospital> findByTypeIgnoreCaseAndLocationContainingIgnoreCase(
            String type,
            String location
    );


    Optional<Hospital> findByUsername(
            String username
    );


    Optional<Hospital> findByHospitalId(
            String hospitalId
    );


    boolean existsByUsername(
            String username
    );


    boolean existsByHospitalId(
            String hospitalId
    );
}