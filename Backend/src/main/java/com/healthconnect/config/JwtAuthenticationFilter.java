package com.healthconnect.config;

import com.healthconnect.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(
            JwtService jwtService) {

        this.jwtService = jwtService;
    }

    @Override
    protected boolean shouldNotFilter(
            HttpServletRequest request) {

        String path =
                request.getServletPath();

        return path.equals("/api/users/login")
                || path.equals("/api/users/register")
                || path.equals("/api/doctors/login")
                || path.equals("/api/doctors/register")
                || path.equals("/api/students/login")
                || path.equals("/api/students/register")
                || path.equals("/api/hospitals/login")
                || path.equals("/api/hospitals/register");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authorizationHeader =
                request.getHeader("Authorization");

        if (authorizationHeader == null ||
                authorizationHeader.isBlank()) {

            SecurityContextHolder.clearContext();

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        if (!authorizationHeader.regionMatches(
                true,
                0,
                "Bearer ",
                0,
                7
        )) {

            SecurityContextHolder.clearContext();

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        String token =
                authorizationHeader
                        .substring(7)
                        .trim();

        if (token.isBlank()) {

            SecurityContextHolder.clearContext();

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        try {

            if (!jwtService.isTokenValid(token)) {

                SecurityContextHolder.clearContext();

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }

            String username =
                    jwtService.extractUsername(token);

            if (username == null ||
                    username.isBlank()) {

                SecurityContextHolder.clearContext();

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }

            String role =
                    jwtService.extractRole(token);

            if (role == null ||
                    role.isBlank()) {

                role = "USER";
            }

            role =
                    role.trim().toUpperCase();

            if (role.startsWith("ROLE_")) {

                role =
                        role.substring(5);
            }

            String authorityName =
                    "ROLE_" + role;

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            Collections.singletonList(
                                    new SimpleGrantedAuthority(
                                            authorityName
                                    )
                            )
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(
                            authentication
                    );

        }

        catch (Exception e) {

            SecurityContextHolder.clearContext();

            System.out.println(
                    "JWT FILTER ERROR: " +
                            e.getMessage()
            );
        }

        filterChain.doFilter(
                request,
                response
        );
    }
}