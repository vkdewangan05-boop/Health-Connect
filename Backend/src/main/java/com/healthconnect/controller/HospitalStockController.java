package com.healthconnect.controller;

import com.healthconnect.entity.HospitalStock;
import com.healthconnect.service.HospitalStockService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospital-stock")
@CrossOrigin(origins = "*")
public class HospitalStockController {

    private final HospitalStockService service;


    public HospitalStockController(
            HospitalStockService service) {

        this.service = service;
    }



    // ==========================================
    // ADD STOCK
    // ==========================================

    @PostMapping
    public ResponseEntity<?> addStock(
            @RequestBody HospitalStock stock) {

        try {

            return ResponseEntity.ok(
                    service.addStock(stock)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }



    // ==========================================
    // GET ALL STOCK
    // ==========================================

    @GetMapping
    public ResponseEntity<List<HospitalStock>>
    getAllStock() {

        return ResponseEntity.ok(
                service.getAllStock()
        );
    }



    // ==========================================
    // GET STOCK BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<HospitalStock>
    getStockById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getStockById(id)
        );
    }



    // ==========================================
    // GET STOCK BY HOSPITAL ID
    // ==========================================

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<HospitalStock>>
    getHospitalStock(
            @PathVariable Long hospitalId) {

        return ResponseEntity.ok(
                service.getHospitalStock(
                        hospitalId
                )
        );
    }



    // ==========================================
    // SEARCH MEDICINE IN HOSPITAL
    // ==========================================

    @GetMapping("/hospital/{hospitalId}/search")
    public ResponseEntity<List<HospitalStock>>
    searchMedicine(
            @PathVariable Long hospitalId,
            @RequestParam String medicineName) {

        return ResponseEntity.ok(
                service.searchMedicine(
                        hospitalId,
                        medicineName
                )
        );
    }



    // ==========================================
    // LOW STOCK
    // ==========================================

    @GetMapping("/low-stock/{hospitalId}")
    public ResponseEntity<List<HospitalStock>>
    getLowStock(
            @PathVariable Long hospitalId) {

        return ResponseEntity.ok(
                service.getLowStock(
                        hospitalId
                )
        );
    }



    // ==========================================
    // UPDATE STOCK
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStock(
            @PathVariable Long id,
            @RequestBody HospitalStock stock) {

        try {

            return ResponseEntity.ok(
                    service.updateStock(
                            id,
                            stock
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }



    // ==========================================
    // DELETE STOCK
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStock(
            @PathVariable Long id) {

        service.deleteStock(id);

        return ResponseEntity.ok(
                "Stock deleted successfully."
        );
    }

}