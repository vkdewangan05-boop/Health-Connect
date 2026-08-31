package com.healthconnect.repository;

import com.healthconnect.entity.HospitalStock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HospitalStockRepository
        extends JpaRepository<HospitalStock, Long> {

    List<HospitalStock> findByHospitalId(Long hospitalId);

    List<HospitalStock> findByMedicineId(Long medicineId);

    Optional<HospitalStock>
    findByHospitalIdAndMedicineId(
            Long hospitalId,
            Long medicineId);

    List<HospitalStock>
    findByHospitalIdAndMedicineNameContainingIgnoreCase(
            Long hospitalId,
            String medicineName);
}