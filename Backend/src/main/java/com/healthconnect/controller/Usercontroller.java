package com.healthconnect.controller;

import com.healthconnect.entity.User;
import com.healthconnect.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class Usercontroller {


    private final UserService userService;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public Usercontroller(
            UserService userService) {

        this.userService = userService;
    }


    // =====================================================
    // REGISTER
    // =====================================================

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @RequestBody User user) {

        try {

            User savedUser =
                    userService.registerUser(user);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedUser);

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // LOGIN
    // =====================================================

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody User user) {

        try {

            // =================================================
            // GENERATE JWT
            // =================================================

            String token =
                    userService.loginUser(
                            user.getUsername(),
                            user.getPassword()
                    );


            // =================================================
            // GET ACTUAL DATABASE USER
            // =================================================

            User loggedInUser =
                    userService.getUserByUsername(
                            user.getUsername()
                    );


            // =================================================
            // NORMALIZE ROLE
            // =================================================

            String role =
                    loggedInUser.getRole();

            if (role == null ||
                    role.isBlank()) {

                role = "USER";
            }

            role =
                    role
                            .trim()
                            .toUpperCase();


            if (role.startsWith("ROLE_")) {

                role =
                        role.substring(5);
            }


            // =================================================
            // RESPONSE
            // =================================================

            Map<String, Object> response =
                    new HashMap<>();


            response.put(
                    "message",
                    "Login successful."
            );


            response.put(
                    "token",
                    token
            );


            response.put(
                    "jwt",
                    token
            );


            response.put(
                    "accessToken",
                    token
            );


            response.put(
                    "id",
                    loggedInUser.getId()
            );


            response.put(
                    "userId",
                    loggedInUser.getId()
            );


            response.put(
                    "fullName",
                    loggedInUser.getFullName()
            );


            response.put(
                    "email",
                    loggedInUser.getEmail()
            );


            response.put(
                    "mobile",
                    loggedInUser.getMobile()
            );


            response.put(
                    "username",
                    loggedInUser.getUsername()
            );


            response.put(
                    "role",
                    role
            );


            response.put(
                    "hospitalName",
                    loggedInUser.getHospitalName()
            );


            return ResponseEntity.ok(
                    response
            );
        }


        catch (RuntimeException e) {

            return ResponseEntity
                    .status(
                            HttpStatus.UNAUTHORIZED
                    )
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // GET ALL USERS
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getAllUsers() {

        try {

            return ResponseEntity.ok(
                    userService.getAllUsers()
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // GET HOSPITAL PATIENTS
    // =====================================================

    @GetMapping("/hospital/{hospitalName}")
    public ResponseEntity<?> getHospitalPatients(
            @PathVariable String hospitalName) {

        try {

            List<User> patients =
                    userService.getHospitalPatients(
                            hospitalName
                    );

            return ResponseEntity.ok(
                    patients
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    // =====================================================
    // ASSIGN PATIENT TO HOSPITAL
    // =====================================================

    @PutMapping("/{id}/hospital")
    public ResponseEntity<?> assignPatientToHospital(
            @PathVariable Long id,
            @RequestParam String hospitalName) {

        try {

            User updatedUser =
                    userService.assignPatientToHospital(
                            id,
                            hospitalName
                    );

            return ResponseEntity.ok(
                    updatedUser
            );

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}