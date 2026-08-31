package com.healthconnect.controller;

import com.healthconnect.entity.CallRequest;
import com.healthconnect.service.CallRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CallRequestController {

    private final CallRequestService callRequestService;

    public CallRequestController(CallRequestService callRequestService) {
        this.callRequestService = callRequestService;
    }

    @PostMapping("/call-requests")
    public ResponseEntity<?> createCallRequest(@RequestBody CallRequest request) {
        try {
            CallRequest created = callRequestService.createRequest(request);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/call-requests/patient/{patientId}")
    public ResponseEntity<List<CallRequest>> getPatientRequests(@PathVariable Long patientId) {
        return ResponseEntity.ok(callRequestService.getRequestsForPatient(patientId));
    }

    @GetMapping("/call-requests/doctor/{doctorId}/pending")
    public ResponseEntity<List<CallRequest>> getDoctorPendingRequests(@PathVariable Long doctorId) {
        return ResponseEntity.ok(callRequestService.getRequestsByDoctor(doctorId));
    }

    @PutMapping("/call-requests/{id}/accept/{doctorId}")
    public ResponseEntity<?> acceptCallRequest(@PathVariable Long id, @PathVariable Long doctorId) {
        try {
            CallRequest updated = callRequestService.acceptRequest(id, doctorId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/call-requests/{id}/reject/{doctorId}")
    public ResponseEntity<?> rejectCallRequest(@PathVariable Long id, @PathVariable Long doctorId) {
        try {
            CallRequest updated = callRequestService.rejectRequest(id, doctorId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}