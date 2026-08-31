package com.healthconnect.controller;

import com.healthconnect.entity.PrescriptionMedicine;
import com.healthconnect.service.PrescriptionMedicineService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescription-medicines")
@CrossOrigin(origins = "*")
public class PrescriptionMedicineController {

    private final PrescriptionMedicineService service;

    public PrescriptionMedicineController(
            PrescriptionMedicineService service) {

        this.service = service;
    }

    @PostMapping
    public ResponseEntity<PrescriptionMedicine>
    addMedicine(
            @RequestBody PrescriptionMedicine medicine) {

        return ResponseEntity.ok(
                service.addMedicine(medicine)
        );
    }

    @GetMapping("/prescription/{prescriptionId}")
    public ResponseEntity<List<PrescriptionMedicine>>
    getPrescriptionMedicines(
            @PathVariable Long prescriptionId) {

        return ResponseEntity.ok(
                service.getPrescriptionMedicines(
                        prescriptionId)
        );
    }

    @GetMapping("/medicine/{medicineId}")
    public ResponseEntity<List<PrescriptionMedicine>>
    getMedicineUsage(
            @PathVariable Long medicineId) {

        return ResponseEntity.ok(
                service.getMedicineUsage(medicineId)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedicine(
            @PathVariable Long id) {

        service.deleteMedicine(id);

        return ResponseEntity.ok(
                "Prescription medicine deleted successfully."
        );
    }
}