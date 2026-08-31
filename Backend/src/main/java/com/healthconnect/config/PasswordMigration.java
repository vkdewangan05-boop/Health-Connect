package com.healthconnect.config;

import com.healthconnect.entity.User;
import com.healthconnect.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordMigration {

    @Bean
    CommandLineRunner migratePasswords(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            System.out.println(
                    "=========================================="
            );

            System.out.println(
                    "HealthConnect Password Migration Started"
            );

            System.out.println(
                    "=========================================="
            );


            for (User user : userRepository.findAll()) {

                String password = user.getPassword();


                // --------------------------------------
                // Skip empty password
                // --------------------------------------

                if (password == null ||
                        password.isBlank()) {

                    continue;
                }


                // --------------------------------------
                // Check whether password is already
                // BCrypt encoded
                // --------------------------------------

                boolean alreadyEncoded =
                        password.startsWith("$2a$")
                        || password.startsWith("$2b$")
                        || password.startsWith("$2y$");


                if (alreadyEncoded) {

                    // Password already secure

                    if (user.getRole() == null ||
                            user.getRole().isBlank()) {

                        user.setRole("USER");

                        userRepository.save(user);
                    }

                    continue;
                }


                // --------------------------------------
                // OLD PLAIN PASSWORD
                // --------------------------------------

                String encodedPassword =
                        passwordEncoder.encode(password);


                user.setPassword(encodedPassword);


                // Existing users become USER
                // unless a role already exists

                if (user.getRole() == null ||
                        user.getRole().isBlank()) {

                    user.setRole("USER");
                }


                userRepository.save(user);


                System.out.println(
                        "Password migrated for user: "
                        + user.getUsername()
                );
            }


            System.out.println(
                    "=========================================="
            );

            System.out.println(
                    "Password Migration Completed"
            );

            System.out.println(
                    "=========================================="
            );
        };
    }
}