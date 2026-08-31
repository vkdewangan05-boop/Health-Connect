package com.healthconnect.controller;

import com.healthconnect.entity.Medicine;
import com.healthconnect.service.MedicineService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "*")
public class MedicineController {

    private final MedicineService service;


    public MedicineController(
            MedicineService service) {

        this.service = service;
    }


    // ==========================================
    // ADD MASTER MEDICINE
    // ==========================================

    @PostMapping
    public ResponseEntity<Medicine> addMedicine(
            @RequestBody Medicine medicine) {

        return ResponseEntity.ok(
                service.addMedicine(medicine)
        );
    }


    // ==========================================
    // AUTOCOMPLETE SEARCH BY NAME
    // ==========================================

    @GetMapping("/search")
    public ResponseEntity<List<Medicine>>
    searchMedicines(
            @RequestParam String name) {

        return ResponseEntity.ok(
                service.searchMedicines(name)
        );
    }


    // ==========================================
    // SEARCH BY GENERIC NAME
    // ==========================================

    @GetMapping("/search/generic")
    public ResponseEntity<List<Medicine>>
    searchByGenericName(
            @RequestParam String name) {

        return ResponseEntity.ok(
                service.searchByGenericName(name)
        );
    }


    // ==========================================
    // SEARCH BY CATEGORY
    // ==========================================

    @GetMapping("/search/category")
    public ResponseEntity<List<Medicine>>
    searchByCategory(
            @RequestParam String category) {

        return ResponseEntity.ok(
                service.searchByCategory(category)
        );
    }


    // ==========================================
    // GET MEDICINE BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<Medicine>
    getMedicineById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getMedicineById(id)
        );
    }


    // ==========================================
    // GET ALL MEDICINES
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Medicine>>
    getAllMedicines() {

        return ResponseEntity.ok(
                service.getAllMedicines()
        );
    }


    // ==========================================
    // DELETE MEDICINE
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String>
    deleteMedicine(
            @PathVariable Long id) {

        service.deleteMedicine(id);

        return ResponseEntity.ok(
                "Medicine deleted successfully."
        );
    }
}