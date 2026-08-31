package com.healthconnect.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;
import java.util.Date;


@Service
public class JwtService {


    // ==========================================
    // JWT SECRET KEY
    // ==========================================

    private static final String SECRET =
            "HealthConnectSuperSecretKeyForJWT2026Security123456789";


    private final SecretKey secretKey =
            Keys.hmacShaKeyFor(
                    SECRET.getBytes(
                            StandardCharsets.UTF_8
                    )
            );


    // ==========================================
    // TOKEN EXPIRATION
    // ==========================================

    private final long expiration =
            1000L * 60 * 60 * 24;


    // ==========================================
    // GENERATE TOKEN
    // ==========================================

    public String generateToken(
            String username,
            String role) {


        if (role == null ||
                role.isBlank()) {

            role = "USER";
        }


        role =
                role.trim()
                        .toUpperCase();


        if (role.startsWith("ROLE_")) {

            role =
                    role.substring(5);
        }


        return Jwts.builder()

                .subject(
                        username
                )

                .claim(
                        "role",
                        role
                )

                .issuedAt(
                        new Date()
                )

                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + expiration
                        )
                )

                .signWith(
                        secretKey
                )

                .compact();
    }


    // ==========================================
    // EXTRACT USERNAME
    // ==========================================

    public String extractUsername(
            String token) {

        return extractAllClaims(
                token
        ).getSubject();
    }


    // ==========================================
    // EXTRACT ROLE
    // ==========================================

    public String extractRole(
            String token) {

        String role =
                extractAllClaims(
                        token
                ).get(
                        "role",
                        String.class
                );


        if (role == null ||
                role.isBlank()) {

            return "USER";
        }


        role =
                role.trim()
                        .toUpperCase();


        if (role.startsWith("ROLE_")) {

            role =
                    role.substring(5);
        }


        return role;
    }


    // ==========================================
    // VALIDATE TOKEN
    // ==========================================

    public boolean isTokenValid(
            String token) {

        try {

            Claims claims =
                    extractAllClaims(
                            token
                    );


            Date expirationDate =
                    claims.getExpiration();


            if (expirationDate == null) {

                return false;
            }


            return expirationDate
                    .after(
                            new Date()
                    );

        }

        catch (Exception e) {

            System.out.println(
                    "JWT validation error: "
                            + e.getMessage()
            );

            return false;
        }
    }


    // ==========================================
    // EXTRACT ALL CLAIMS
    // ==========================================

    private Claims extractAllClaims(
            String token) {

        return Jwts.parser()

                .verifyWith(
                        secretKey
                )

                .build()

                .parseSignedClaims(
                        token
                )

                .getPayload();
    }
}