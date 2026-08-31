package com.healthconnect.repository;

import com.healthconnect.entity.Appointment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {


    // =====================================================
    // USER APPOINTMENTS
    // =====================================================

    List<Appointment> findByUserId(
            Long userId
    );


    // =====================================================
    // DOCTOR APPOINTMENTS
    // =====================================================

    List<Appointment> findByDoctorId(
            Long doctorId
    );


    // =====================================================
    // HOSPITAL APPOINTMENTS
    // =====================================================

    List<Appointment> findByHospitalId(
            Long hospitalId
    );


    // =====================================================
    // STATUS
    // =====================================================

    List<Appointment> findByStatusIgnoreCase(
            String status
    );


    // =====================================================
    // CONSULTATION APPOINTMENT SUPPORT
    // =====================================================

    List<Appointment>
    findByUserIdAndDoctorIdAndTypeIgnoreCase(
            Long userId,
            Long doctorId,
            String type
    );
}