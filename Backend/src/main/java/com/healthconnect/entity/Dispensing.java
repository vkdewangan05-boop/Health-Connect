package com.healthconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "dispensing")
public class Dispensing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long hospitalId;

    private Long userId;

    private Long medicineId;

    private Long prescriptionId;

    private String medicineName;

    private Integer quantity;

    private String dispensingDate;

    private String dispensedBy;

    public Dispensing() {
    }

    public Dispensing(
            Long id,
            Long hospitalId,
            Long userId,
            Long medicineId,
            Long prescriptionId,
            String medicineName,
            Integer quantity,
            String dispensingDate,
            String dispensedBy) {

        this.id = id;
        this.hospitalId = hospitalId;
        this.userId = userId;
        this.medicineId = medicineId;
        this.prescriptionId = prescriptionId;
        this.medicineName = medicineName;
        this.quantity = quantity;
        this.dispensingDate = dispensingDate;
        this.dispensedBy = dispensedBy;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getMedicineId() {
        return medicineId;
    }

    public void setMedicineId(Long medicineId) {
        this.medicineId = medicineId;
    }

    public Long getPrescriptionId() {
        return prescriptionId;
    }

    public void setPrescriptionId(Long prescriptionId) {
        this.prescriptionId = prescriptionId;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public void setMedicineName(String medicineName) {
        this.medicineName = medicineName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getDispensingDate() {
        return dispensingDate;
    }

    public void setDispensingDate(String dispensingDate) {
        this.dispensingDate = dispensingDate;
    }

    public String getDispensedBy() {
        return dispensedBy;
    }

    public void setDispensedBy(String dispensedBy) {
        this.dispensedBy = dispensedBy;
    }
}