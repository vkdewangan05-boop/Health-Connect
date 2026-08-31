package com.healthconnect.repository;

import com.healthconnect.entity.CallRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CallRequestRepository extends JpaRepository<CallRequest, Long> {

    // Patient ke saare requests get karne ke liye
    List<CallRequest> findByPatientId(Long patientId);

    // Doctor ke specific status (eg: PENDING) wale requests get karne ke liye
    List<CallRequest> findByDoctorIdAndStatus(Long doctorId, String status);

    // Doctor ke saare requests get karne ke liye (if needed)
    List<CallRequest> findByDoctorId(Long doctorId);
}