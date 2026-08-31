package com.healthconnect.service;

import com.healthconnect.entity.PrescriptionMedicine;
import com.healthconnect.repository.PrescriptionMedicineRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrescriptionMedicineService {

    private final PrescriptionMedicineRepository repository;

    public PrescriptionMedicineService(
            PrescriptionMedicineRepository repository) {

        this.repository = repository;
    }

    public PrescriptionMedicine addMedicine(
            PrescriptionMedicine medicine) {

        return repository.save(medicine);
    }

    public List<PrescriptionMedicine>
    getPrescriptionMedicines(Long prescriptionId) {

        return repository.findByPrescriptionId(prescriptionId);
    }

    public List<PrescriptionMedicine>
    getMedicineUsage(Long medicineId) {

        return repository.findByMedicineId(medicineId);
    }

    public void deleteMedicine(Long id) {
        repository.deleteById(id);
    }
}