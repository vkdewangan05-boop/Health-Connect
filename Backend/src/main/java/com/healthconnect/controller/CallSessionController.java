package com.healthconnect.controller;

import com.healthconnect.entity.CallSession;
import com.healthconnect.service.CallSessionService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/call-sessions")
@CrossOrigin(origins = "*")
public class CallSessionController {


    private final CallSessionService callSessionService;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public CallSessionController(
            CallSessionService callSessionService) {

        this.callSessionService =
                callSessionService;
    }


    // ==========================================
    // CREATE CALL SESSION
    // ==========================================

    @PostMapping("/start/{callRequestId}")
    public ResponseEntity<?> createSession(
            @PathVariable Long callRequestId) {

        try {

            CallSession session = invokeCreateSession(callRequestId);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(session);

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    private CallSession invokeCreateSession(Long callRequestId) {
        String[] methodNames = {
                "createSession",
                "createCallSession",
                "startSession",
                "createCallRequestSession"
        };

        for (String methodName : methodNames) {
            try {
                Object result = callSessionService
                        .getClass()
                        .getMethod(methodName, Long.class)
                        .invoke(callSessionService, callRequestId);

                if (result instanceof CallSession session) {
                    return session;
                }

                throw new RuntimeException(
                        "Session creation for callRequestId " + callRequestId + " did not return a CallSession"
                );
            }
            catch (NoSuchMethodException ignored) {
                try {
                    Object result = callSessionService
                            .getClass()
                            .getMethod(methodName, long.class)
                            .invoke(callSessionService, callRequestId);

                    if (result instanceof CallSession session) {
                        return session;
                    }

                    throw new RuntimeException(
                            "Session creation for callRequestId " + callRequestId + " did not return a CallSession"
                    );
                }
                catch (NoSuchMethodException ignoredAgain) {
                    // Try next known naming convention.
                }
                catch (Exception ex) {
                    throw new RuntimeException(
                            "Failed to invoke session creation: " + methodName,
                            ex
                    );
                }
            }
            catch (Exception ex) {
                throw new RuntimeException(
                        "Failed to invoke session creation: " + methodName,
                        ex
                );
            }
        }

        throw new RuntimeException(
                "No matching session creation method found for callRequestId: " + callRequestId
        );
    }


    // ==========================================
    // GET SESSION
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getSession(
            @PathVariable Long id) {

        try {

            CallSession session =
                    (CallSession) invokeSessionLookupObject(
                    "getSession",
                    "findById",
                    null,
                    id
            );

            if (session instanceof CallSession) {
                return ResponseEntity.ok(
                        (CallSession) session
                );
            }

            throw new RuntimeException(
                    "Session not found or invalid type for id: " + id
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // ==========================================
    // GET PATIENT SESSIONS
    // ==========================================

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getPatientSessions(
            @PathVariable Long patientId) {

        try {

            List<CallSession> sessions =
                    invokeSessionLookup(
                            "getPatientSessions",
                            "getSessionsByPatientId",
                            "getPatientSession",
                            patientId
                    );


            return ResponseEntity.ok(
                    sessions
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // ==========================================
    // GET DOCTOR SESSIONS
    // ==========================================

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getDoctorSessions(
            @PathVariable Long doctorId) {

        try {

            List<CallSession> sessions =
                    invokeSessionLookup(
                            "getDoctorSessions",
                            "getSessionsByDoctorId",
                            "getDoctorSession",
                            doctorId
                    );


            return ResponseEntity.ok(
                    sessions
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    private List<CallSession> invokeSessionLookup(
            String primaryMethod,
            String secondaryMethod,
            String fallbackMethod,
            Long id) {

        Object result = invokeSessionLookupObject(
                primaryMethod,
                secondaryMethod,
                fallbackMethod,
                id
        );

        if (result instanceof List<?> sessionList) {
            return sessionList
                    .stream()
                    .filter(CallSession.class::isInstance)
                    .map(CallSession.class::cast)
                    .toList();
        }

        throw new RuntimeException(
                "Session lookup for id " + id + " did not return a list of CallSession objects"
        );
    }

    private Object invokeSessionLookupObject(
            String primaryMethod,
            String secondaryMethod,
            String fallbackMethod,
            Long id) {

        String[] methodNames = {
                primaryMethod,
                secondaryMethod,
                fallbackMethod
        };

        for (String methodName : methodNames) {

            if (methodName == null || methodName.isBlank()) {
                continue;
            }

            try {

                return callSessionService
                        .getClass()
                        .getMethod(methodName, Long.class)
                        .invoke(callSessionService, id);

            }
            catch (NoSuchMethodException ignored) {

                try {

                    return callSessionService
                            .getClass()
                            .getMethod(methodName, long.class)
                            .invoke(callSessionService, id);

                }
                catch (NoSuchMethodException ignoredAgain) {

                    // Try next known naming convention.
                }
                catch (Exception ex) {

                    throw new RuntimeException(
                            "Failed to invoke session lookup: " + methodName,
                            ex
                    );
                }
            }
            catch (Exception ex) {

                throw new RuntimeException(
                        "Failed to invoke session lookup: " + methodName,
                        ex
                );
            }
        }

        throw new RuntimeException(
                "No matching session lookup method found for id: " + id
        );
    }


    // ==========================================
    // END CALL
    // ==========================================

    @PutMapping("/{id}/end")
    public ResponseEntity<?> endSession(
            @PathVariable Long id) {

        try {

            CallSession session =
                    callSessionService
                            .endSession(
                                    id
                            );


            return ResponseEntity.ok(
                    session
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}