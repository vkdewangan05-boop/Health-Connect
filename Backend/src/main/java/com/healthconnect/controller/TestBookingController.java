package com.healthconnect.controller;

import com.healthconnect.entity.TestBooking;
import com.healthconnect.service.TestBookingService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-bookings")
@CrossOrigin(origins = "*")
public class TestBookingController {


    private final TestBookingService service;


    public TestBookingController(
            TestBookingService service) {

        this.service = service;
    }


    // ==========================================
    // CREATE BOOKING
    // ==========================================

    @PostMapping
    public ResponseEntity<?> createBooking(
            @RequestBody TestBooking booking) {

        try {

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(
                            service.createBooking(
                                    booking
                            )
                    );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // ==========================================
    // ALL BOOKINGS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<TestBooking>>
    getAllBookings() {

        return ResponseEntity.ok(
                service.getAllBookings()
        );
    }


    // ==========================================
    // USER BOOKINGS
    // ==========================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TestBooking>>
    getUserBookings(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                service.getUserBookings(
                        userId
                )
        );
    }


    // ==========================================
    // HOSPITAL BOOKINGS
    // ==========================================

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<TestBooking>>
    getHospitalBookings(
            @PathVariable Long hospitalId) {

        return ResponseEntity.ok(
                service.getHospitalBookings(
                        hospitalId
                )
        );
    }


    // ==========================================
    // GET BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<TestBooking>
    getBookingById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getBookingById(id)
        );
    }


    // ==========================================
    // UPDATE STATUS
    // ==========================================

    @PutMapping("/{id}/status")
    public ResponseEntity<TestBooking>
    updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(
                service.updateStatus(
                        id,
                        status
                )
        );
    }
}