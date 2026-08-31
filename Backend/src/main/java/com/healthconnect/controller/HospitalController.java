package com.healthconnect.controller;

import com.healthconnect.entity.Hospital;
import com.healthconnect.service.HospitalService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = "*")
public class HospitalController {


    private final HospitalService service;


    public HospitalController(
            HospitalService service) {

        this.service = service;
    }


    // ==========================================
    // REGISTER
    // ==========================================

    @PostMapping("/register")
    public ResponseEntity<?> registerHospital(
            @RequestBody Hospital hospital) {

        try {

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            service.registerHospital(
                                    hospital
                            )
                    );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // ==========================================
    // LOGIN
    // ==========================================

    @PostMapping("/login")
    public ResponseEntity<?> loginHospital(
            @RequestBody Hospital hospital) {

        try {

            return ResponseEntity.ok(
                    service.loginHospital(
                            hospital.getUsername(),
                            hospital.getPassword()
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }


    // ==========================================
    // GET ALL
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Hospital>>
    getAllHospitals() {

        return ResponseEntity.ok(
                service.getAllHospitals()
        );
    }


    // ==========================================
    // GET BY HOSPITAL ID
    // ==========================================

    @GetMapping("/hospital-id/{hospitalId}")
    public ResponseEntity<Hospital>
    getHospitalByHospitalId(
            @PathVariable String hospitalId) {

        return ResponseEntity.ok(
                service.getHospitalByHospitalId(
                        hospitalId
                )
        );
    }


    // ==========================================
    // SEARCH LOCATION
    // ==========================================

    @GetMapping("/location/{location}")
    public ResponseEntity<List<Hospital>>
    getByLocation(
            @PathVariable String location) {

        return ResponseEntity.ok(
                service.searchByLocation(location)
        );
    }


    // ==========================================
    // SEARCH TYPE
    // ==========================================

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Hospital>>
    getByType(
            @PathVariable String type) {

        return ResponseEntity.ok(
                service.searchByType(type)
        );
    }


    // ==========================================
    // SEARCH TYPE + LOCATION
    // ==========================================

    @GetMapping("/type/{type}/location/{location}")
    public ResponseEntity<List<Hospital>>
    getByTypeAndLocation(
            @PathVariable String type,
            @PathVariable String location) {

        return ResponseEntity.ok(
                service.searchByTypeAndLocation(
                        type,
                        location
                )
        );
    }


    // ==========================================
    // GET DATABASE ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<Hospital>
    getHospitalById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getHospitalById(id)
        );
    }


    // ==========================================
    // UPDATE
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<Hospital>
    updateHospital(
            @PathVariable Long id,
            @RequestBody Hospital hospital) {

        return ResponseEntity.ok(
                service.updateHospital(
                        id,
                        hospital
                )
        );
    }


    // ==========================================
    // DELETE
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String>
    deleteHospital(
            @PathVariable Long id) {

        service.deleteHospital(id);

        return ResponseEntity.ok(
                "Hospital deleted successfully."
        );
    }
}