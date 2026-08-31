package com.healthconnect.service;

import com.healthconnect.entity.Doctor;
import com.healthconnect.entity.User;
import com.healthconnect.repository.DoctorRepository;
import com.healthconnect.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public DoctorService(
            DoctorRepository doctorRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }


    // =====================================================
    // REGISTER DOCTOR
    // =====================================================

    public Doctor registerDoctor(
            Doctor doctor) {

        if (doctor == null) {
            throw new IllegalArgumentException(
                    "Doctor information is required."
            );
        }


        // =================================================
        // BASIC VALIDATION
        // =================================================

        if (doctor.getFullName() == null ||
                doctor.getFullName().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Doctor name is required."
            );
        }


        if (doctor.getUsername() == null ||
                doctor.getUsername().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Doctor username is required."
            );
        }


        if (doctor.getEmail() == null ||
                doctor.getEmail().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Doctor email is required."
            );
        }


        if (doctor.getPassword() == null ||
                doctor.getPassword().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Doctor password is required."
            );
        }


        // =================================================
        // DOCTOR IDENTITY NUMBER
        // =================================================

        if (doctor.getDoctorIdentityNumber() == null ||
                doctor.getDoctorIdentityNumber()
                        .trim()
                        .isEmpty()) {

            throw new IllegalArgumentException(
                    "Doctor Identity Number is required."
            );
        }


        String doctorIdentityNumber =
                doctor.getDoctorIdentityNumber()
                        .trim()
                        .toUpperCase();


        // =================================================
        // DUPLICATE DOCTOR IDENTITY NUMBER
        // =================================================

        if (doctorRepository
                .existsByDoctorIdentityNumber(
                        doctorIdentityNumber
                )) {

            throw new RuntimeException(
                    "Doctor Identity Number is already registered."
            );
        }


        // =================================================
        // DOCTOR TYPE
        // =================================================

        if (doctor.getDoctorType() == null ||
                doctor.getDoctorType().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Doctor type is required."
            );
        }


        String doctorType =
                doctor.getDoctorType()
                        .trim()
                        .toUpperCase();


        if (!doctorType.equals("GOVERNMENT") &&
                !doctorType.equals("PRIVATE")) {

            throw new IllegalArgumentException(
                    "Doctor type must be GOVERNMENT or PRIVATE."
            );
        }


        // =================================================
        // DUPLICATE USERNAME
        // =================================================

        if (doctorRepository.existsByUsername(
                doctor.getUsername().trim())) {

            throw new RuntimeException(
                    "Doctor username already exists."
            );
        }


        if (userRepository.existsByUsername(
                doctor.getUsername().trim())) {

            throw new RuntimeException(
                    "Username already exists."
            );
        }


        // =================================================
        // DUPLICATE EMAIL
        // =================================================

        if (doctorRepository.existsByEmail(
                doctor.getEmail().trim())) {

            throw new RuntimeException(
                    "Doctor email already registered."
            );
        }


        if (userRepository.existsByEmail(
                doctor.getEmail().trim())) {

            throw new RuntimeException(
                    "Email already registered."
            );
        }


        // =================================================
        // NORMALIZE DATA
        // =================================================

        doctor.setUsername(
                doctor.getUsername().trim()
        );

        doctor.setEmail(
                doctor.getEmail().trim()
        );

        doctor.setDoctorIdentityNumber(
                doctorIdentityNumber
        );

        doctor.setDoctorType(
                doctorType
        );


        // =================================================
        // DEFAULT STATUS
        // =================================================

        doctor.setAvailable(true);

        doctor.setStatus(
                "PENDING"
        );


        // =================================================
        // PASSWORD HASH
        // =================================================

        String encodedPassword =
                passwordEncoder.encode(
                        doctor.getPassword()
                );

        doctor.setPassword(
                encodedPassword
        );


        // =================================================
        // SAVE DOCTOR
        // =================================================

        Doctor savedDoctor =
                doctorRepository.save(
                        doctor
                );


        // =================================================
        // CREATE LOGIN USER
        // =================================================

        User user = new User();

        user.setFullName(
                doctor.getFullName()
        );

        user.setEmail(
                doctor.getEmail()
        );

        user.setMobile(
                doctor.getMobile()
        );

        user.setUsername(
                doctor.getUsername()
        );

        user.setPassword(
                encodedPassword
        );

        user.setRole(
                "DOCTOR"
        );

        userRepository.save(
                user
        );


        return savedDoctor;
    }


    // =====================================================
    // LOGIN DOCTOR
    // =====================================================

    public String loginDoctor(
            String username,
            String password) {

        if (username == null ||
                username.trim().isEmpty()) {

            throw new RuntimeException(
                    "Username is required."
            );
        }


        if (password == null ||
                password.trim().isEmpty()) {

            throw new RuntimeException(
                    "Password is required."
            );
        }


        Doctor doctor =
                doctorRepository
                        .findByUsername(
                                username.trim()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found."
                                )
                        );


        if (!passwordEncoder.matches(
                password,
                doctor.getPassword()
        )) {

            throw new RuntimeException(
                    "Invalid doctor username or password."
            );
        }


        return jwtService.generateToken(
                doctor.getUsername(),
                "DOCTOR"
        );
    }


    // =====================================================
    // GET DOCTOR BY USERNAME
    // =====================================================

    public Doctor getDoctorByUsername(
            String username) {

        return doctorRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor not found."
                        )
                );
    }


    // =====================================================
    // GET ALL DOCTORS
    // =====================================================

    public List<Doctor> getAllDoctors() {

        return doctorRepository
                .findAll();
    }


    // =====================================================
    // SEARCH DOCTORS
    // NAME / ID / SPECIALIZATION
    // =====================================================

    public List<Doctor> searchDoctors(
            String search) {

        if (search == null ||
                search.trim().isEmpty()) {

            return getAllDoctors();
        }


        String value =
                search.trim();


        // =================================================
        // SEARCH BY DATABASE ID
        // =================================================

        if (value.matches("\\d+")) {

            try {

                Long id =
                        Long.parseLong(value);


                Doctor doctor =
                        doctorRepository
                                .findById(id)
                                .orElse(null);


                if (doctor != null) {

                    List<Doctor> result =
                            new ArrayList<>();

                    result.add(doctor);

                    return result;
                }

            }

            catch (NumberFormatException ignored) {
            }
        }


        // =================================================
        // SEARCH BY DOCTOR IDENTITY NUMBER
        // =================================================

        Doctor identityDoctor =
                doctorRepository
                        .findByDoctorIdentityNumber(
                                value.toUpperCase()
                        )
                        .orElse(null);


        if (identityDoctor != null) {

            List<Doctor> result =
                    new ArrayList<>();

            result.add(identityDoctor);

            return result;
        }


        // =================================================
        // SEARCH BY NAME
        // =================================================

        List<Doctor> nameResults =
                doctorRepository
                        .findByFullNameContainingIgnoreCaseOrderByFullNameAsc(
                                value
                        );


        // =================================================
        // SEARCH BY SPECIALIZATION
        // =================================================

        List<Doctor> specializationResults =
                doctorRepository
                        .findBySpecializationContainingIgnoreCaseOrderByFullNameAsc(
                                value
                        );


        // =================================================
        // COMBINE WITHOUT DUPLICATES
        // =================================================

        List<Doctor> combined =
                new ArrayList<>();


        for (Doctor doctor : nameResults) {

            if (!combined.contains(doctor)) {

                combined.add(doctor);
            }
        }


        for (Doctor doctor :
                specializationResults) {

            if (!combined.contains(doctor)) {

                combined.add(doctor);
            }
        }


        return combined;
    }


    // =====================================================
    // GET DOCTORS BY TYPE
    // =====================================================

    public List<Doctor> getDoctorsByType(
            String doctorType) {

        if (doctorType == null ||
                doctorType.isBlank()) {

            throw new IllegalArgumentException(
                    "Doctor type is required."
            );
        }


        return doctorRepository
                .findByDoctorType(
                        doctorType
                                .trim()
                                .toUpperCase()
                );
    }


    // =====================================================
    // GET AVAILABLE DOCTORS BY TYPE
    // =====================================================

    public List<Doctor> getAvailableDoctorsByType(
            String doctorType) {

        if (doctorType == null ||
                doctorType.isBlank()) {

            throw new IllegalArgumentException(
                    "Doctor type is required."
            );
        }


        return doctorRepository
                .findByDoctorTypeAndAvailable(
                        doctorType
                                .trim()
                                .toUpperCase(),
                        true
                );
    }


    // =====================================================
    // GET HOSPITAL DOCTORS
    // =====================================================

    public List<Doctor> getHospitalDoctors(
            String hospitalName) {

        if (hospitalName == null ||
                hospitalName.isBlank()) {

            throw new IllegalArgumentException(
                    "Hospital name is required."
            );
        }


        return doctorRepository
                .findByHospitalNameIgnoreCase(
                        hospitalName.trim()
                );
    }


    // =====================================================
    // GET AVAILABLE HOSPITAL DOCTORS
    // =====================================================

    public List<Doctor> getAvailableHospitalDoctors(
            String hospitalName) {

        if (hospitalName == null ||
                hospitalName.isBlank()) {

            throw new IllegalArgumentException(
                    "Hospital name is required."
            );
        }


        return doctorRepository
                .findByHospitalNameIgnoreCaseAndAvailable(
                        hospitalName.trim(),
                        true
                );
    }
}