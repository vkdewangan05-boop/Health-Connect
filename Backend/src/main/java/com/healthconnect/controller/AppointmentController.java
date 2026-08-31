package com.healthconnect.controller;

import com.healthconnect.entity.Appointment;
import com.healthconnect.service.AppointmentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(
            @RequestBody Appointment appointment) {

        return ResponseEntity.ok(
                service.createAppointment(appointment)
        );
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {

        return ResponseEntity.ok(
                service.getAllAppointments()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getAppointmentById(id)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Appointment>> getUserAppointments(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                service.getUserAppointments(userId)
        );
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(
            @PathVariable Long doctorId) {

        return ResponseEntity.ok(
                service.getDoctorAppointments(doctorId)
        );
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<Appointment>> getHospitalAppointments(
            @PathVariable Long hospitalId) {

        return ResponseEntity.ok(
                service.getHospitalAppointments(hospitalId)
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Appointment>>
    getAppointmentsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                service.getAppointmentsByStatus(status)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(
            @PathVariable Long id,
            @RequestBody Appointment appointment) {

        return ResponseEntity.ok(
                service.updateAppointment(id, appointment)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAppointment(
            @PathVariable Long id) {

        service.deleteAppointment(id);

        return ResponseEntity.ok(
                "Appointment deleted successfully."
        );
    }
}