package com.healthconnect.repository;

import com.healthconnect.entity.PrescriptionMedicine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionMedicineRepository
        extends JpaRepository<PrescriptionMedicine, Long> {

    List<PrescriptionMedicine>
    findByPrescriptionId(Long prescriptionId);

    List<PrescriptionMedicine>
    findByMedicineId(Long medicineId);
}