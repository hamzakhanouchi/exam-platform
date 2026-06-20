package com.exam.platform.controller;

import com.exam.platform.dto.request.RegisterRequest;
import com.exam.platform.dto.response.UserResponse;
import com.exam.platform.enums.Role;
import com.exam.platform.mapper.UserMapper;
import com.exam.platform.repository.ExamRepository;
import com.exam.platform.repository.ExamSessionRepository;
import com.exam.platform.repository.SecurityLogRepository;
import com.exam.platform.repository.UserRepository;
import com.exam.platform.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final ExamRepository examRepository;
    private final ExamSessionRepository examSessionRepository;
    private final SecurityLogRepository securityLogRepository;
    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalExams", examRepository.count());
        stats.put("totalSessions", examSessionRepository.count());
        stats.put("totalLogs", securityLogRepository.count());
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/teachers")
    public ResponseEntity<UserResponse> createTeacher(@RequestBody RegisterRequest request) {
        request.setRole(Role.PROFESSOR);
        var user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toResponse(user));
    }
}