package com.healthconnect.repository;

import com.healthconnect.entity.Dispensing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DispensingRepository
        extends JpaRepository<Dispensing, Long> {

    List<Dispensing> findByHospitalId(Long hospitalId);

    List<Dispensing> findByUserId(Long userId);

    List<Dispensing> findByPrescriptionId(Long prescriptionId);
}