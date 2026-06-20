package com.exam.platform.service.impl;

import com.exam.platform.dto.request.LoginRequest;
import com.exam.platform.dto.request.RegisterRequest;
import com.exam.platform.dto.response.AuthResponse;
import com.exam.platform.entity.User;
import com.exam.platform.enums.Role;
import com.exam.platform.exception.ConflictException;
import com.exam.platform.repository.UserRepository;
import com.exam.platform.security.CustomUserDetails;
import com.exam.platform.security.JwtTokenProvider;
import com.exam.platform.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        return new AuthResponse(jwt, user.getId(), user.getUsername(), user.getEmail(), user.getRole().name());
    }

    public void register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ConflictException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email is already in use");
        }
        // Forcer le rôle à STUDENT
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.STUDENT) // ← FORCÉ
                .enabled(true)
                .build();
        userRepository.save(user);
    }
}