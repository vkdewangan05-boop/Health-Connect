package com.healthconnect.service;

import com.healthconnect.entity.MedicalRecord;
import com.healthconnect.repository.MedicalRecordRepository;

import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class MedicalRecordService {


    private final MedicalRecordRepository medicalRecordRepository;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public MedicalRecordService(
            MedicalRecordRepository medicalRecordRepository) {

        this.medicalRecordRepository =
                medicalRecordRepository;
    }


    // ==========================================
    // ADD MEDICAL RECORD
    // ==========================================

    public MedicalRecord addRecord(
            MedicalRecord record) {


        if (record == null) {

            throw new IllegalArgumentException(
                    "Medical record must not be null."
            );
        }


        // ==========================================
        // USER ID CHECK
        // ==========================================

        if (record.getUserId() == null) {

            throw new IllegalArgumentException(
                    "User ID is required."
            );
        }


        // ==========================================
        // DOCTOR NAME CHECK
        // ==========================================

        if (
                record.getDoctorName() == null ||
                record.getDoctorName().isBlank()
        ) {

            throw new IllegalArgumentException(
                    "Doctor name is required."
            );
        }


        // ==========================================
        // DIAGNOSIS CHECK
        // ==========================================

        if (
                record.getDiagnosis() == null ||
                record.getDiagnosis().isBlank()
        ) {

            throw new IllegalArgumentException(
                    "Diagnosis is required."
            );
        }


        // ==========================================
        // CONSULTATION ID
        // ==========================================
        //
        // New records should preferably be linked
        // with their consultation.
        //
        // Existing records can remain null until
        // they are linked.
        //
        // ==========================================

        if (record.getConsultationId() != null) {

            if (record.getConsultationId() <= 0) {

                throw new IllegalArgumentException(
                        "Consultation ID must be valid."
                );

            }

        }


        // ==========================================
        // SAVE RECORD
        // ==========================================

        return medicalRecordRepository.save(
                record
        );
    }


    // ==========================================
    // GET ALL RECORDS
    // ==========================================

    public List<MedicalRecord> getAllRecords() {

        return medicalRecordRepository.findAll();

    }


    // ==========================================
    // GET RECORD BY ID
    // ==========================================

    public MedicalRecord getRecordById(
            Long id) {


        if (id == null) {

            throw new IllegalArgumentException(
                    "Medical record ID is required."
            );

        }


        return medicalRecordRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Medical record not found."
                        )
                );

    }


    // ==========================================
    // GET USER RECORDS
    // ==========================================

    public List<MedicalRecord> getUserRecords(
            Long userId) {


        if (userId == null) {

            throw new IllegalArgumentException(
                    "User ID is required."
            );

        }


        return medicalRecordRepository
                .findByUserId(userId);

    }


    // ==========================================
    // DELETE RECORD
    // ==========================================

    public void deleteRecord(
            Long id) {


        if (id == null) {

            throw new IllegalArgumentException(
                    "Medical record ID is required."
            );

        }


        if (
                !medicalRecordRepository
                        .existsById(id)
        ) {

            throw new IllegalArgumentException(
                    "Medical record not found."
            );

        }


        medicalRecordRepository.deleteById(
                id
        );

    }

}