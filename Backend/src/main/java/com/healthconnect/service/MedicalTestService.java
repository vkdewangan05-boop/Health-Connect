package com.healthconnect.service;

import com.healthconnect.entity.MedicalTest;
import com.healthconnect.repository.MedicalTestRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicalTestService {

    private final MedicalTestRepository repository;


    public MedicalTestService(
            MedicalTestRepository repository) {

        this.repository = repository;
    }


    // ==========================================
    // CREATE TEST
    // ==========================================

    public MedicalTest createTest(
            MedicalTest test) {

        if (test == null) {
            throw new RuntimeException(
                    "Test data is required."
            );
        }

        if (test.getHospitalId() == null) {
            throw new RuntimeException(
                    "Hospital ID is required."
            );
        }

        if (test.getTestName() == null ||
                test.getTestName().isBlank()) {

            throw new RuntimeException(
                    "Test name is required."
            );
        }

        if (test.getPrice() == null) {
            test.setPrice(0.0);
        }

        if (test.getAvailable() == null) {
            test.setAvailable(true);
        }

        return repository.save(test);
    }


    // ==========================================
    // GET ALL TESTS
    // ==========================================

    public List<MedicalTest> getAllTests() {

        return repository.findAll();
    }


    // ==========================================
    // GET TEST BY ID
    // ==========================================

    public MedicalTest getTestById(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Medical test not found."
                        )
                );
    }


    // ==========================================
    // GET HOSPITAL TESTS
    // ==========================================

    public List<MedicalTest> getHospitalTests(
            Long hospitalId) {

        return repository.findByHospitalId(
                hospitalId
        );
    }


    // ==========================================
    // GET AVAILABLE HOSPITAL TESTS
    // ==========================================

    public List<MedicalTest> getAvailableHospitalTests(
            Long hospitalId) {

        return repository
                .findByHospitalIdAndAvailable(
                        hospitalId,
                        true
                );
    }


    // ==========================================
    // UPDATE
    // ==========================================

    public MedicalTest updateTest(
            Long id,
            MedicalTest test) {

        MedicalTest existing =
                getTestById(id);

        existing.setHospitalId(
                test.getHospitalId()
        );

        existing.setTestName(
                test.getTestName()
        );

        existing.setDescription(
                test.getDescription()
        );

        existing.setPrice(
                test.getPrice()
        );

        existing.setSampleType(
                test.getSampleType()
        );

        existing.setReportTime(
                test.getReportTime()
        );

        existing.setPreparationInstructions(
                test.getPreparationInstructions()
        );

        existing.setAvailable(
                test.getAvailable()
        );

        return repository.save(existing);
    }


    // ==========================================
    // DELETE
    // ==========================================

    public void deleteTest(Long id) {

        repository.deleteById(id);
    }
}