package com.healthconnect.service;

import com.healthconnect.entity.Hospital;
import com.healthconnect.repository.HospitalRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HospitalService {

    private final HospitalRepository repository;

    private final PasswordEncoder passwordEncoder;


    public HospitalService(
            HospitalRepository repository,
            PasswordEncoder passwordEncoder) {

        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }


    // ==========================================
    // REGISTER HOSPITAL
    // ==========================================

    public Hospital registerHospital(
            Hospital hospital) {

        if (hospital == null) {
            throw new RuntimeException(
                    "Hospital data is required."
            );
        }

        if (hospital.getName() == null ||
                hospital.getName().isBlank()) {

            throw new RuntimeException(
                    "Hospital name is required."
            );
        }

        if (hospital.getUsername() == null ||
                hospital.getUsername().isBlank()) {

            throw new RuntimeException(
                    "Username is required."
            );
        }

        if (hospital.getPassword() == null ||
                hospital.getPassword().isBlank()) {

            throw new RuntimeException(
                    "Password is required."
            );
        }

        if (hospital.getType() == null ||
                hospital.getType().isBlank()) {

            throw new RuntimeException(
                    "Hospital type is required."
            );
        }

        if (repository.existsByUsername(
                hospital.getUsername())) {

            throw new RuntimeException(
                    "Hospital username already exists."
            );
        }


        if (hospital.getAvailable() == null ||
                hospital.getAvailable().isBlank()) {

            hospital.setAvailable("YES");
        }


        if (hospital.getFacilities() == null) {
            hospital.setFacilities("");
        }


        String hospitalId;

        do {

            hospitalId =
                    "HC-HOSP-" +
                    (10000 +
                    (int) (Math.random() * 90000));

        } while (
                repository.existsByHospitalId(
                        hospitalId
                )
        );


        hospital.setHospitalId(
                hospitalId
        );


        hospital.setPassword(
                passwordEncoder.encode(
                        hospital.getPassword()
                )
        );


        return repository.save(hospital);
    }


    // ==========================================
    // LOGIN
    // ==========================================

    public Hospital loginHospital(
            String username,
            String password) {

        if (username == null ||
                username.isBlank()) {

            throw new RuntimeException(
                    "Username is required."
            );
        }

        if (password == null ||
                password.isBlank()) {

            throw new RuntimeException(
                    "Password is required."
            );
        }


        Hospital hospital =
                repository.findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid hospital username or password."
                                )
                        );


        if (!passwordEncoder.matches(
                password,
                hospital.getPassword())) {

            throw new RuntimeException(
                    "Invalid hospital username or password."
            );
        }


        return hospital;
    }


    // ==========================================
    // GET ALL
    // ==========================================

    public List<Hospital> getAllHospitals() {

        return repository.findAll();
    }


    // ==========================================
    // GET BY ID
    // ==========================================

    public Hospital getHospitalById(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Hospital not found."
                        )
                );
    }


    // ==========================================
    // GET BY HOSPITAL ID
    // ==========================================

    public Hospital getHospitalByHospitalId(
            String hospitalId) {

        return repository.findByHospitalId(hospitalId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Hospital not found."
                        )
                );
    }


    // ==========================================
    // SEARCH LOCATION
    // ==========================================

    public List<Hospital> searchByLocation(
            String location) {

        if (location == null ||
                location.isBlank()) {

            throw new RuntimeException(
                    "Location is required."
            );
        }


        return repository
                .findByLocationContainingIgnoreCase(
                        location.trim()
                );
    }


    // ==========================================
    // SEARCH TYPE
    // ==========================================

    public List<Hospital> searchByType(
            String type) {

        if (type == null ||
                type.isBlank()) {

            throw new RuntimeException(
                    "Hospital type is required."
            );
        }


        return repository.findByTypeIgnoreCase(
                type.trim()
        );
    }


    // ==========================================
    // SEARCH TYPE + LOCATION
    // ==========================================

    public List<Hospital> searchByTypeAndLocation(
            String type,
            String location) {

        if (type == null ||
                type.isBlank()) {

            throw new RuntimeException(
                    "Hospital type is required."
            );
        }

        if (location == null ||
                location.isBlank()) {

            throw new RuntimeException(
                    "Location is required."
            );
        }


        return repository
                .findByTypeIgnoreCaseAndLocationContainingIgnoreCase(
                        type.trim(),
                        location.trim()
                );
    }


    // ==========================================
    // UPDATE
    // ==========================================

    public Hospital updateHospital(
            Long id,
            Hospital hospital) {

        Hospital existing =
                getHospitalById(id);


        existing.setName(
                hospital.getName()
        );

        existing.setLocation(
                hospital.getLocation()
        );

        existing.setType(
                hospital.getType()
        );

        existing.setEmergencyContact(
                hospital.getEmergencyContact()
        );

        existing.setFacilities(
                hospital.getFacilities()
        );

        existing.setAvailable(
                hospital.getAvailable()
        );


        return repository.save(existing);
    }


    // ==========================================
    // DELETE
    // ==========================================

    public void deleteHospital(Long id) {

        repository.deleteById(id);
    }
}