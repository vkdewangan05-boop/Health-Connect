package com.healthconnect.service;

import com.healthconnect.entity.Doctor;
import com.healthconnect.entity.User;
import com.healthconnect.repository.DoctorRepository;
import com.healthconnect.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final DoctorRepository doctorRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public UserService(
            UserRepository userRepository,
            DoctorRepository doctorRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;

        this.doctorRepository = doctorRepository;

        this.passwordEncoder = passwordEncoder;

        this.jwtService = jwtService;
    }


    // ==========================================
    // REGISTER USER
    // ==========================================

    public User registerUser(User user) {

        if (user == null) {

            throw new IllegalArgumentException(
                    "User must not be null."
            );
        }


        if (user.getUsername() == null ||
                user.getUsername().isBlank()) {

            throw new IllegalArgumentException(
                    "Username must not be blank."
            );
        }


        if (user.getEmail() == null ||
                user.getEmail().isBlank()) {

            throw new IllegalArgumentException(
                    "Email must not be blank."
            );
        }


        if (user.getPassword() == null ||
                user.getPassword().isBlank()) {

            throw new IllegalArgumentException(
                    "Password must not be blank."
            );
        }


        if (userRepository.existsByUsername(
                user.getUsername())) {

            throw new RuntimeException(
                    "Username already exists."
            );
        }


        if (userRepository.existsByEmail(
                user.getEmail())) {

            throw new RuntimeException(
                    "Email already registered."
            );
        }


        // ==========================================
        // DEFAULT ROLE
        // ==========================================

        if (user.getRole() == null ||
                user.getRole().isBlank()) {

            user.setRole("USER");
        }


        // ==========================================
        // NORMALIZE ROLE
        // ==========================================

        user.setRole(
                user.getRole()
                        .trim()
                        .toUpperCase()
        );


        // ==========================================
        // HASH PASSWORD
        // ==========================================

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );


        return userRepository.save(user);
    }


    // ==========================================
    // LOGIN USER / DOCTOR
    // ==========================================

    public String loginUser(
            String username,
            String password) {

        // ==========================================
        // USERNAME VALIDATION
        // ==========================================

        if (username == null ||
                username.isBlank()) {

            throw new RuntimeException(
                    "Username is required."
            );
        }


        // ==========================================
        // PASSWORD VALIDATION
        // ==========================================

        if (password == null ||
                password.isBlank()) {

            throw new RuntimeException(
                    "Password is required."
            );
        }


        String cleanUsername =
                username.trim();


        // ==========================================
        // FIRST CHECK DOCTOR TABLE
        // ==========================================
        //
        // This prevents a doctor from accidentally
        // receiving USER role because of an old
        // duplicate USER record.
        //

        Doctor doctor =
                doctorRepository
                        .findByUsername(
                                cleanUsername
                        )
                        .orElse(null);


        if (doctor != null) {

            // ======================================
            // DOCTOR PASSWORD CHECK
            // ======================================

            boolean doctorPasswordMatches =
                    passwordEncoder.matches(
                            password,
                            doctor.getPassword()
                    );


            if (!doctorPasswordMatches) {

                throw new RuntimeException(
                        "Invalid username or password."
                );
            }


            // ======================================
            // DOCTOR JWT
            // ======================================

            return jwtService.generateToken(
                    doctor.getUsername(),
                    "DOCTOR"
            );
        }


        // ==========================================
        // FIND NORMAL USER
        // ==========================================

        User user =
                userRepository
                        .findByUsername(
                                cleanUsername
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid username or password."
                                )
                        );


        // ==========================================
        // PASSWORD CHECK
        // ==========================================

        boolean passwordMatches =
                passwordEncoder.matches(
                        password,
                        user.getPassword()
                );


        if (!passwordMatches) {

            throw new RuntimeException(
                    "Invalid username or password."
            );
        }


        // ==========================================
        // OLD USERS MIGRATION
        // ==========================================

        if (user.getRole() == null ||
                user.getRole().isBlank()) {

            user.setRole("USER");

            userRepository.save(user);
        }


        // ==========================================
        // NORMALIZE ROLE
        // ==========================================

        String role =
                user.getRole()
                        .trim()
                        .toUpperCase();


        // ==========================================
        // REMOVE ROLE_ PREFIX IF PRESENT
        // ==========================================

        if (role.startsWith("ROLE_")) {

            role =
                    role.substring(5);
        }


        // ==========================================
        // ALLOWED USER ROLES
        // ==========================================

        if (!role.equals("USER") &&
                !role.equals("ADMIN")) {

            throw new RuntimeException(
                    "Invalid user role."
            );
        }


        // ==========================================
        // SAVE NORMALIZED ROLE
        // ==========================================

        if (!role.equals(user.getRole())) {

            user.setRole(role);

            userRepository.save(user);
        }


        // ==========================================
        // GENERATE JWT
        // ==========================================

        return jwtService.generateToken(
                user.getUsername(),
                role
        );
    }


    // ==========================================
    // GET USER BY USERNAME
    // ==========================================

    public User getUserByUsername(
            String username) {

        if (username == null ||
                username.isBlank()) {

            throw new RuntimeException(
                    "Username is required."
            );
        }


        return userRepository
                .findByUsername(
                        username.trim()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found."
                        )
                );
    }


    // ==========================================
    // GET ALL USERS
    // ==========================================

    public List<User> getAllUsers() {

        return userRepository.findAll();
    }


    // ==========================================
    // GET PATIENTS OF HOSPITAL
    // ==========================================

    public List<User> getHospitalPatients(
            String hospitalName) {

        if (hospitalName == null ||
                hospitalName.isBlank()) {

            throw new IllegalArgumentException(
                    "Hospital name is required."
            );
        }


        return userRepository
                .findByHospitalNameIgnoreCaseAndRole(
                        hospitalName.trim(),
                        "USER"
                );
    }


    // ==========================================
    // ASSIGN PATIENT TO HOSPITAL
    // ==========================================

    public User assignPatientToHospital(
            Long userId,
            String hospitalName) {

        if (hospitalName == null ||
                hospitalName.isBlank()) {

            throw new IllegalArgumentException(
                    "Hospital name is required."
            );
        }


        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient not found."
                                )
                        );


        if (user.getRole() == null ||
                !user.getRole()
                        .equalsIgnoreCase("USER")) {

            throw new RuntimeException(
                    "Selected account is not a patient."
            );
        }


        user.setHospitalName(
                hospitalName.trim()
        );


        return userRepository.save(user);
    }
}