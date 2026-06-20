package com.exam.platform.controller;

import com.exam.platform.dto.request.LoginRequest;
import com.exam.platform.dto.request.RegisterRequest;
import com.exam.platform.dto.response.AuthResponse;
import com.exam.platform.enums.Role;
import com.exam.platform.service.impl.AuthServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthServiceImpl authServiceImpl;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authServiceImpl.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        // Seuls les étudiants peuvent s'inscrire publiquement
        request.setRole(Role.STUDENT);
        authServiceImpl.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}