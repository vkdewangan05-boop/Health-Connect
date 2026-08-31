package com.healthconnect.service;

import com.healthconnect.entity.Prescription;
import com.healthconnect.repository.PrescriptionRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrescriptionService {

    private final PrescriptionRepository repository;

    public PrescriptionService(PrescriptionRepository repository) {
        this.repository = repository;
    }

    public Prescription createPrescription(
            Prescription prescription) {

        return repository.save(prescription);
    }

    public List<Prescription> getAllPrescriptions() {
        return repository.findAll();
    }

    public Prescription getPrescriptionById(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Prescription not found."));
    }

    public List<Prescription> getUserPrescriptions(Long userId) {
        return repository.findByUserId(userId);
    }

    public List<Prescription> getDoctorPrescriptions(Long doctorId) {
        return repository.findByDoctorId(doctorId);
    }

    public List<Prescription> getConsultationPrescriptions(
            Long consultationId) {

        return repository.findByConsultationId(consultationId);
    }

    public Prescription updatePrescription(
            Long id,
            Prescription prescription) {

        Prescription existing = getPrescriptionById(id);

        existing.setUserId(prescription.getUserId());
        existing.setDoctorId(prescription.getDoctorId());
        existing.setConsultationId(
                prescription.getConsultationId());
        existing.setDiagnosis(prescription.getDiagnosis());
        existing.setInstructions(
                prescription.getInstructions());
        existing.setPrescriptionDate(
                prescription.getPrescriptionDate());
        existing.setStatus(prescription.getStatus());

        return repository.save(existing);
    }

    public void deletePrescription(Long id) {
        repository.deleteById(id);
    }
}