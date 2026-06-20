package com.exam.platform.service;

import com.exam.platform.dto.request.LoginRequest;
import com.exam.platform.dto.request.RegisterRequest;
import com.exam.platform.dto.response.AuthResponse;
import com.exam.platform.security.JwtTokenProvider;

public interface AuthService {
    public AuthResponse login(LoginRequest request);
    public void register(RegisterRequest request) ;

    
}

