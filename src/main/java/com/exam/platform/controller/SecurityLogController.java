package com.exam.platform.controller;

import com.exam.platform.dto.request.SecurityLogRequest;
import com.exam.platform.dto.response.SecurityLogResponse;
import com.exam.platform.entity.SecurityLog;
import com.exam.platform.repository.SecurityLogRepository;
import com.exam.platform.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/security-logs")
@RequiredArgsConstructor
@Slf4j
public class SecurityLogController {

    private final SecurityLogRepository securityLogRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SecurityLogResponse>> getAllLogs() {
        List<SecurityLog> logs = securityLogRepository.findAllWithUser();
        List<SecurityLogResponse> response = logs.stream()
                .map(log -> SecurityLogResponse.builder()
                        .id(log.getId())
                        .eventType(log.getEventType())
                        .details(log.getDetails() != null ? log.getDetails() : "")
                        .timestamp(log.getTimestamp())
                        .userId(log.getUser() != null ? log.getUser().getId() : null)
                        .username(log.getUser() != null ? log.getUser().getUsername() : "Inconnu")
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> createSecurityLog(@RequestBody SecurityLogRequest request,
                                               @AuthenticationPrincipal CustomUserDetails currentUser) {
        try {
            SecurityLog log = SecurityLog.builder()
                    .user(currentUser.getUser())
                    .eventType(request.getEventType())
                    .details(request.getDetails())
                    .timestamp(LocalDateTime.now())
                    .build();
            securityLogRepository.save(log);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            log.error("Erreur lors de l'enregistrement du log", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}