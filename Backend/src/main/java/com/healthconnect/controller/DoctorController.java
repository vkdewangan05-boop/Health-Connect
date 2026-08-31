package com.healthconnect.controller;

import com.healthconnect.entity.Doctor;
import com.healthconnect.service.DoctorService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {


    private final DoctorService doctorService;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public DoctorController(
            DoctorService doctorService) {

        this.doctorService =
                doctorService;
    }


    // =====================================================
    // REGISTER
    // =====================================================

    @PostMapping("/register")
    public ResponseEntity<?> registerDoctor(
            @RequestBody Doctor doctor) {

        try {

            Doctor savedDoctor =
                    doctorService.registerDoctor(
                            doctor
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedDoctor);

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // LOGIN
    // =====================================================

    @PostMapping("/login")
    public ResponseEntity<?> loginDoctor(
            @RequestBody Doctor doctor) {

        try {

            String token =
                    doctorService.loginDoctor(
                            doctor.getUsername(),
                            doctor.getPassword()
                    );


            Doctor loggedInDoctor =
                    doctorService.getDoctorByUsername(
                            doctor.getUsername()
                    );


            Map<String, Object> response =
                    new HashMap<>();


            response.put(
                    "message",
                    "Doctor login successful."
            );

            response.put(
                    "token",
                    token
            );

            response.put(
                    "id",
                    loggedInDoctor.getId()
            );

            response.put(
                    "doctorId",
                    loggedInDoctor.getId()
            );

            response.put(
                    "fullName",
                    loggedInDoctor.getFullName()
            );

            response.put(
                    "email",
                    loggedInDoctor.getEmail()
            );

            response.put(
                    "mobile",
                    loggedInDoctor.getMobile()
            );

            response.put(
                    "username",
                    loggedInDoctor.getUsername()
            );

            response.put(
                    "specialization",
                    loggedInDoctor.getSpecialization()
            );

            response.put(
                    "qualification",
                    loggedInDoctor.getQualification()
            );

            response.put(
                    "experience",
                    loggedInDoctor.getExperience()
            );

            response.put(
                    "consultationFee",
                    loggedInDoctor.getConsultationFee()
            );

            response.put(
                    "doctorType",
                    loggedInDoctor.getDoctorType()
            );

            response.put(
                    "doctorIdentityNumber",
                    loggedInDoctor
                            .getDoctorIdentityNumber()
            );

            response.put(
                    "location",
                    loggedInDoctor.getLocation()
            );

            response.put(
                    "hospitalName",
                    loggedInDoctor.getHospitalName()
            );

            response.put(
                    "hospitalAddress",
                    loggedInDoctor.getHospitalAddress()
            );

            response.put(
                    "available",
                    loggedInDoctor.getAvailable()
            );

            response.put(
                    "status",
                    loggedInDoctor.getStatus()
            );

            response.put(
                    "role",
                    "DOCTOR"
            );


            return ResponseEntity.ok(
                    response
            );
        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .status(
                            HttpStatus.UNAUTHORIZED
                    )
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // GET ALL
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getAllDoctors() {

        try {

            return ResponseEntity.ok(
                    doctorService.getAllDoctors()
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // SEARCH
    // NAME / DOCTOR ID / SPECIALIZATION
    // =====================================================

    @GetMapping("/search")
    public ResponseEntity<?> searchDoctors(
            @RequestParam String query) {

        try {

            return ResponseEntity.ok(
                    doctorService.searchDoctors(
                            query
                    )
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // TYPE
    // =====================================================

    @GetMapping("/type/{doctorType}")
    public ResponseEntity<?> getDoctorsByType(
            @PathVariable String doctorType) {

        try {

            return ResponseEntity.ok(
                    doctorService.getDoctorsByType(
                            doctorType
                    )
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // AVAILABLE BY TYPE
    // =====================================================

    @GetMapping("/available/{doctorType}")
    public ResponseEntity<?> getAvailableDoctorsByType(
            @PathVariable String doctorType) {

        try {

            return ResponseEntity.ok(
                    doctorService
                            .getAvailableDoctorsByType(
                                    doctorType
                            )
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // LOCATION
    // =====================================================

    @GetMapping("/location/{location}")
    public ResponseEntity<?> getDoctorsByLocation(
            @PathVariable String location) {

        try {

            if (location == null ||
                    location.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Location is required."
                        );
            }


            List<Doctor> doctors =
                    doctorService.getAllDoctors();


            String searchLocation =
                    location
                            .trim()
                            .toLowerCase();


            doctors.removeIf(
                    doctor -> {

                        if (doctor.getLocation() ==
                                null) {

                            return true;
                        }


                        return !doctor
                                .getLocation()
                                .toLowerCase()
                                .contains(
                                        searchLocation
                                );
                    }
            );


            return ResponseEntity.ok(
                    doctors
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // HOSPITAL DOCTORS
    // =====================================================

    @GetMapping("/hospital/{hospitalName}")
    public ResponseEntity<?> getHospitalDoctors(
            @PathVariable String hospitalName) {

        try {

            return ResponseEntity.ok(
                    doctorService.getHospitalDoctors(
                            hospitalName
                    )
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =====================================================
    // TYPE AND LOCATION
    // =====================================================

    @GetMapping("/type/{doctorType}/location/{location}")
    public ResponseEntity<?> getDoctorsByTypeAndLocation(
            @PathVariable String doctorType,
            @PathVariable String location) {

        try {
            if (location == null || location.isBlank()) {
                return ResponseEntity.badRequest().body("Location is required.");
            }

            // Pehle type ke basis par doctors le aao (ya service method use karo)
            List<Doctor> doctors = doctorService.getDoctorsByType(doctorType);

            String searchLocation = location.trim().toLowerCase();

            doctors.removeIf(
                    doctor -> {
                        if (doctor.getLocation() == null) {
                            return true;
                        }
                        return !doctor
                                .getLocation()
                                .toLowerCase()
                                .contains(searchLocation);
                    }
            );

            return ResponseEntity.ok(doctors);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}