package com.healthconnect.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;

import java.util.Arrays;


@Configuration
@EnableWebSecurity
public class SecurityConfig {


    // =====================================================
    // PASSWORD ENCODER
    // =====================================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    // =====================================================
    // JWT FILTER
    // =====================================================

    private final JwtAuthenticationFilter
            jwtAuthenticationFilter;


    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }


    // =====================================================
    // CORS
    // =====================================================

    @Bean
    public CorsConfigurationSource
    corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();


        configuration.setAllowedOrigins(
                Arrays.asList(
                        "http://localhost:3000",
                        "http://127.0.0.1:3000",
                        "http://localhost:5500",
                        "http://127.0.0.1:5500",
                        "http://localhost:5501",
                        "http://127.0.0.1:5501",
                        "http://localhost:8080",
                        "http://127.0.0.1:8080"
                )
        );


        configuration.setAllowedMethods(
                Arrays.asList(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );


        configuration.setAllowedHeaders(
                Arrays.asList("*")
        );


        configuration.setAllowCredentials(false);


        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();


        source.registerCorsConfiguration(
                "/**",
                configuration
        );


        return source;
    }


    // =====================================================
    // SECURITY
    // =====================================================

    @Bean
    public SecurityFilterChain
    securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                .csrf(
                        csrf ->
                                csrf.disable()
                )

                .cors(
                        cors -> {
                        }
                )

                .sessionManagement(
                        session ->
                                session.sessionCreationPolicy(
                                        SessionCreationPolicy.STATELESS
                                )
                )

                .exceptionHandling(
                        exception ->
                                exception
                                        .authenticationEntryPoint(
                                                authenticationEntryPoint()
                                        )
                                        .accessDeniedHandler(
                                                accessDeniedHandler()
                                        )
                )

                .authorizeHttpRequests(
                        auth -> auth


                                // =================================
                                // LOGIN / REGISTER
                                // =================================

                                .requestMatchers(
                                        "/api/users/login",
                                        "/api/users/register",
                                        "/api/doctors/login",
                                        "/api/doctors/register",
                                        "/api/students/login",
                                        "/api/students/register",
                                        "/api/hospitals/login",
                                        "/api/hospitals/register"
                                )
                                .permitAll()


                                // =================================
                                // CONSULTATION CREATE
                                // =================================

                                .requestMatchers(
                                        org.springframework.http.HttpMethod.POST,
                                        "/api/consultations"
                                )
                                .permitAll()


                                // =================================
                                // CONSULTATION READ
                                // =================================

                                .requestMatchers(
                                        org.springframework.http.HttpMethod.GET,
                                        "/api/consultations/**"
                                )
                                .permitAll()


                                // =================================
                                // CONSULTATION ACCEPT
                                // =================================

                                .requestMatchers(
                                        org.springframework.http.HttpMethod.PUT,
                                        "/api/consultations/*/accept/*"
                                )
                                .authenticated()


                                // =================================
                                // CONSULTATION REJECT
                                // =================================

                                .requestMatchers(
                                        org.springframework.http.HttpMethod.PUT,
                                        "/api/consultations/*/reject/*"
                                )
                                .authenticated()


                                // =================================
                                // OTHER CONSULTATION PUT
                                // =================================

                                .requestMatchers(
                                        org.springframework.http.HttpMethod.PUT,
                                        "/api/consultations/**"
                                )
                                .permitAll()


                                // =================================
                                // DOCTOR READ APIs
                                // =================================

                                .requestMatchers(
                                        org.springframework.http.HttpMethod.GET,
                                        "/api/doctors",
                                        "/api/doctors/type/**",
                                        "/api/doctors/available/**",
                                        "/api/doctors/location/**"
                                )
                                .permitAll()


                                // =================================
                                // APPOINTMENTS
                                // =================================

                                .requestMatchers(
                                        "/api/appointments/**"
                                )
                                .permitAll()


                                // =================================
                                // OTHER EXISTING APIs
                                // =================================

                                .requestMatchers(
                                        "/api/health-surveys/**",
                                        "/api/prescriptions/**",
                                        "/api/prescription-medicines/**",
                                        "/api/hospital-stock/**",
                                        "/api/dispensing/**",
                                        "/api/call-requests/**",
                                        "/api/call-sessions/**"
                                )
                                .permitAll()


                                // =================================
                                // EVERYTHING ELSE
                                // =================================

                                .anyRequest()
                                .permitAll()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }


    // =====================================================
    // 401
    // =====================================================

    @Bean
    public AuthenticationEntryPoint
    authenticationEntryPoint() {

        return (
                request,
                response,
                authException
        ) -> {

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );


            response.setContentType(
                    "application/json"
            );


            response.getWriter().write(
                    "{\"message\":\"Unauthorized\"}"
            );
        };
    }


    // =====================================================
    // 403
    // =====================================================

    @Bean
    public AccessDeniedHandler
    accessDeniedHandler() {

        return (
                request,
                response,
                accessDeniedException
        ) -> {

            response.setStatus(
                    HttpServletResponse.SC_FORBIDDEN
            );


            response.setContentType(
                    "application/json"
            );


            response.getWriter().write(
                    "{\"message\":\"Access denied\"}"
            );
        };
    }
}