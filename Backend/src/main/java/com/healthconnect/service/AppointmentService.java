package com.healthconnect.service;

import com.healthconnect.entity.Appointment;
import com.healthconnect.repository.AppointmentRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository repository;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public AppointmentService(
            AppointmentRepository repository) {

        this.repository =
                repository;
    }


    // =====================================================
    // CREATE
    // =====================================================

    public Appointment createAppointment(
            Appointment appointment) {

        if (appointment == null) {

            throw new IllegalArgumentException(
                    "Appointment must not be null."
            );
        }

        return repository.save(
                appointment
        );
    }


    // =====================================================
    // GET ALL
    // =====================================================

    public List<Appointment> getAllAppointments() {

        return repository.findAll();
    }


    // =====================================================
    // GET BY ID
    // =====================================================

    public Appointment getAppointmentById(
            Long id) {

        return repository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Appointment not found."
                        )
                );
    }


    // =====================================================
    // USER APPOINTMENTS
    // =====================================================

    public List<Appointment> getUserAppointments(
            Long userId) {

        if (userId == null) {

            throw new IllegalArgumentException(
                    "User ID is required."
            );
        }

        return repository.findByUserId(
                userId
        );
    }


    // =====================================================
    // DOCTOR APPOINTMENTS
    // =====================================================

    public List<Appointment> getDoctorAppointments(
            Long doctorId) {

        if (doctorId == null) {

            throw new IllegalArgumentException(
                    "Doctor ID is required."
            );
        }

        return repository.findByDoctorId(
                doctorId
        );
    }


    // =====================================================
    // HOSPITAL APPOINTMENTS
    // =====================================================

    public List<Appointment> getHospitalAppointments(
            Long hospitalId) {

        if (hospitalId == null) {

            throw new IllegalArgumentException(
                    "Hospital ID is required."
            );
        }

        return repository.findByHospitalId(
                hospitalId
        );
    }


    // =====================================================
    // STATUS
    // =====================================================

    public List<Appointment> getAppointmentsByStatus(
            String status) {

        if (status == null ||
                status.isBlank()) {

            throw new IllegalArgumentException(
                    "Status is required."
            );
        }

        return repository
                .findByStatusIgnoreCase(
                        status.trim()
                );
    }


    // =====================================================
    // UPDATE
    // =====================================================

    public Appointment updateAppointment(
            Long id,
            Appointment appointment) {

        if (appointment == null) {

            throw new IllegalArgumentException(
                    "Appointment data is required."
            );
        }

        Appointment existing =
                getAppointmentById(id);


        existing.setUserId(
                appointment.getUserId()
        );

        existing.setDoctorId(
                appointment.getDoctorId()
        );

        existing.setHospitalId(
                appointment.getHospitalId()
        );

        existing.setAppointmentDate(
                appointment.getAppointmentDate()
        );

        existing.setAppointmentTime(
                appointment.getAppointmentTime()
        );

        existing.setReason(
                appointment.getReason()
        );

        existing.setType(
                appointment.getType()
        );

        existing.setStatus(
                appointment.getStatus()
        );


        return repository.save(
                existing
        );
    }


    // =====================================================
    // DELETE
    // =====================================================

    public void deleteAppointment(
            Long id) {

        repository.deleteById(
                id
        );
    }
}