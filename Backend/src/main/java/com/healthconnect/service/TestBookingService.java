package com.healthconnect.service;

import com.healthconnect.entity.TestBooking;
import com.healthconnect.repository.TestBookingRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestBookingService {

    private final TestBookingRepository repository;


    public TestBookingService(
            TestBookingRepository repository) {

        this.repository = repository;
    }


    // ==========================================
    // CREATE BOOKING
    // ==========================================

    public TestBooking createBooking(
            TestBooking booking) {

        if (booking == null) {
            throw new RuntimeException(
                    "Booking data is required."
            );
        }

        if (booking.getUserId() == null) {
            throw new RuntimeException(
                    "User ID is required."
            );
        }

        if (booking.getHospitalId() == null) {
            throw new RuntimeException(
                    "Hospital ID is required."
            );
        }

        if (booking.getMedicalTestId() == null) {
            throw new RuntimeException(
                    "Medical test ID is required."
            );
        }

        if (booking.getBookingDate() == null ||
                booking.getBookingDate().isBlank()) {

            throw new RuntimeException(
                    "Booking date is required."
            );
        }

        if (booking.getBookingTime() == null ||
                booking.getBookingTime().isBlank()) {

            throw new RuntimeException(
                    "Booking time is required."
            );
        }


        if (booking.getStatus() == null ||
                booking.getStatus().isBlank()) {

            booking.setStatus("PENDING");
        }


        return repository.save(booking);
    }


    // ==========================================
    // USER BOOKINGS
    // ==========================================

    public List<TestBooking> getUserBookings(
            Long userId) {

        return repository.findByUserId(userId);
    }


    // ==========================================
    // HOSPITAL BOOKINGS
    // ==========================================

    public List<TestBooking> getHospitalBookings(
            Long hospitalId) {

        return repository.findByHospitalId(
                hospitalId
        );
    }


    // ==========================================
    // ALL
    // ==========================================

    public List<TestBooking> getAllBookings() {

        return repository.findAll();
    }


    // ==========================================
    // GET BY ID
    // ==========================================

    public TestBooking getBookingById(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Test booking not found."
                        )
                );
    }


    // ==========================================
    // UPDATE STATUS
    // ==========================================

    public TestBooking updateStatus(
            Long id,
            String status) {

        TestBooking booking =
                getBookingById(id);

        booking.setStatus(status);

        return repository.save(booking);
    }
}