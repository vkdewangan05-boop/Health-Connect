package com.healthconnect.service;

import com.healthconnect.entity.Dispensing;
import com.healthconnect.entity.HospitalStock;

import com.healthconnect.repository.DispensingRepository;
import com.healthconnect.repository.HospitalStockRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DispensingService {

    private final DispensingRepository dispensingRepository;

    private final HospitalStockRepository stockRepository;

    public DispensingService(
            DispensingRepository dispensingRepository,
            HospitalStockRepository stockRepository) {

        this.dispensingRepository = dispensingRepository;
        this.stockRepository = stockRepository;
    }

    public Dispensing dispenseMedicine(
            Dispensing dispensing) {

        HospitalStock stock =
                stockRepository
                        .findByHospitalIdAndMedicineId(
                                dispensing.getHospitalId(),
                                dispensing.getMedicineId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                "Medicine stock not found."));

        if (stock.getQuantity()
                < dispensing.getQuantity()) {

            throw new RuntimeException(
                    "Insufficient medicine stock.");
        }

        stock.setQuantity(
                stock.getQuantity()
                        - dispensing.getQuantity());

        stockRepository.save(stock);

        return dispensingRepository.save(dispensing);
    }

    public List<Dispensing> getAllDispensing() {

        return dispensingRepository.findAll();
    }

    public Dispensing getDispensingById(Long id) {

        return dispensingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Dispensing record not found."));
    }

    public List<Dispensing>
    getHospitalDispensing(Long hospitalId) {

        return dispensingRepository
                .findByHospitalId(hospitalId);
    }

    public List<Dispensing>
    getUserDispensing(Long userId) {

        return dispensingRepository
                .findByUserId(userId);
    }

    public List<Dispensing>
    getPrescriptionDispensing(
            Long prescriptionId) {

        return dispensingRepository
                .findByPrescriptionId(prescriptionId);
    }
}