package com.healthconnect.repository;

import com.healthconnect.entity.Medicine;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicineRepository
        extends JpaRepository<Medicine, Long> {


    // ==========================================
    // AUTOCOMPLETE SEARCH
    // ==========================================
    // Example:
    // P    -> Paracetamol, Pantoprazole...
    // Pa   -> Paracetamol, Pantoprazole...
    // Para -> Paracetamol...

    List<Medicine>
    findByNameStartingWithIgnoreCaseOrderByNameAsc(
            String name
    );


    // ==========================================
    // SEARCH BY GENERIC NAME
    // ==========================================

    List<Medicine>
    findByGenericNameStartingWithIgnoreCaseOrderByGenericNameAsc(
            String genericName
    );


    // ==========================================
    // SEARCH BY CATEGORY
    // ==========================================

    List<Medicine>
    findByCategoryContainingIgnoreCaseOrderByNameAsc(
            String category
    );
}