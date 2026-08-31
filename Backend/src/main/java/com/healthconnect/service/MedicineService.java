package com.healthconnect.service;

import com.healthconnect.entity.Medicine;
import com.healthconnect.repository.MedicineRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicineService {

    private final MedicineRepository repository;


    public MedicineService(
            MedicineRepository repository) {

        this.repository = repository;
    }


    // ==========================================
    // ADD MASTER MEDICINE
    // ==========================================

    public Medicine addMedicine(
            Medicine medicine) {

        return repository.save(medicine);
    }


    // ==========================================
    // GET ALL MASTER MEDICINES
    // ==========================================

    public List<Medicine> getAllMedicines() {

        return repository.findAll();
    }


    // ==========================================
    // GET MEDICINE BY ID
    // ==========================================

    public Medicine getMedicineById(
            Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Medicine not found."
                        )
                );
    }


    // ==========================================
    // AUTOCOMPLETE MEDICINE SEARCH
    // ==========================================

    public List<Medicine> searchMedicines(
            String name) {

        if (name == null ||
                name.trim().isEmpty()) {

            return List.of();
        }

        return repository
                .findByNameStartingWithIgnoreCaseOrderByNameAsc(
                        name.trim()
                );
    }


    // ==========================================
    // SEARCH BY GENERIC NAME
    // ==========================================

    public List<Medicine> searchByGenericName(
            String genericName) {

        if (genericName == null ||
                genericName.trim().isEmpty()) {

            return List.of();
        }

        return repository
                .findByGenericNameStartingWithIgnoreCaseOrderByGenericNameAsc(
                        genericName.trim()
                );
    }


    // ==========================================
    // SEARCH BY CATEGORY
    // ==========================================

    public List<Medicine> searchByCategory(
            String category) {

        if (category == null ||
                category.trim().isEmpty()) {

            return List.of();
        }

        return repository
                .findByCategoryContainingIgnoreCaseOrderByNameAsc(
                        category.trim()
                );
    }


    // ==========================================
    // DELETE MEDICINE
    // ==========================================

    public void deleteMedicine(Long id) {

        if (!repository.existsById(id)) {

            throw new RuntimeException(
                    "Medicine not found."
            );
        }

        repository.deleteById(id);
    }
}