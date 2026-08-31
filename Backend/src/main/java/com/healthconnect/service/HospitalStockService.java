package com.healthconnect.service;

import com.healthconnect.entity.HospitalStock;
import com.healthconnect.repository.HospitalStockRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HospitalStockService {

    private final HospitalStockRepository repository;


    public HospitalStockService(
            HospitalStockRepository repository) {

        this.repository = repository;
    }


    // ==========================================
    // ADD STOCK
    // ==========================================

    public HospitalStock addStock(
            HospitalStock stock) {

        if (stock.getHospitalId() == null) {

            throw new RuntimeException(
                    "Hospital ID is required."
            );
        }


        if (stock.getMedicineId() == null) {

            throw new RuntimeException(
                    "Medicine ID is required."
            );
        }


        if (stock.getMedicineName() == null ||
                stock.getMedicineName()
                        .trim()
                        .isEmpty()) {

            throw new RuntimeException(
                    "Medicine name is required."
            );
        }


        if (stock.getQuantity() == null ||
                stock.getQuantity() < 0) {

            throw new RuntimeException(
                    "Quantity cannot be negative."
            );
        }


        if (stock.getReorderLevel() == null ||
                stock.getReorderLevel() < 0) {

            throw new RuntimeException(
                    "Reorder level cannot be negative."
            );
        }


        return repository.save(stock);
    }



    // ==========================================
    // GET ALL STOCK
    // ==========================================

    public List<HospitalStock> getAllStock() {

        return repository.findAll();
    }



    // ==========================================
    // GET HOSPITAL STOCK
    // ==========================================

    public List<HospitalStock>
    getHospitalStock(Long hospitalId) {

        return repository.findByHospitalId(
                hospitalId
        );
    }



    // ==========================================
    // SEARCH MEDICINE IN HOSPITAL
    // ==========================================

    public List<HospitalStock>
    searchMedicine(
            Long hospitalId,
            String medicineName) {

        return repository
                .findByHospitalIdAndMedicineNameContainingIgnoreCase(
                        hospitalId,
                        medicineName
                );
    }



    // ==========================================
    // GET STOCK BY ID
    // ==========================================

    public HospitalStock getStockById(Long id) {

        return repository.findById(id)

                .orElseThrow(() ->
                        new RuntimeException(
                                "Stock item not found."
                        )
                );
    }



    // ==========================================
    // UPDATE STOCK
    // ==========================================

    public HospitalStock updateStock(
            Long id,
            HospitalStock stock) {

        HospitalStock existing =
                getStockById(id);


        existing.setHospitalId(
                stock.getHospitalId()
        );


        existing.setMedicineId(
                stock.getMedicineId()
        );


        existing.setMedicineName(
                stock.getMedicineName()
        );


        existing.setQuantity(
                stock.getQuantity()
        );


        existing.setReorderLevel(
                stock.getReorderLevel()
        );


        existing.setBatchNumber(
                stock.getBatchNumber()
        );


        existing.setExpiryDate(
                stock.getExpiryDate()
        );


        return repository.save(existing);
    }



    // ==========================================
    // LOW STOCK
    // ==========================================

    public List<HospitalStock>
    getLowStock(Long hospitalId) {

        List<HospitalStock> stocks =
                repository.findByHospitalId(
                        hospitalId
                );


        return stocks.stream()

                .filter(stock ->
                        stock.getQuantity() != null &&
                        stock.getReorderLevel() != null &&
                        stock.getQuantity()
                                <= stock.getReorderLevel()
                )

                .toList();
    }



    // ==========================================
    // DELETE STOCK
    // ==========================================

    public void deleteStock(Long id) {

        repository.deleteById(id);
    }

}