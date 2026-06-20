package com.exam.platform.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class SecurityLogResponse {
    private Long id;
    private String eventType;
    private String details;
    private LocalDateTime timestamp;
    private Long userId;
    private String username;
}