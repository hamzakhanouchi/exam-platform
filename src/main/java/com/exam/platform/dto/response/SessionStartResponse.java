package com.exam.platform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionStartResponse {
    private Long sessionId;
    private String examTitle;
    private int durationMinutes;
    private LocalDateTime startedAt;
    private List<QuestionResponse> questions; // déjà présent, assurez-vous d'avoir un setter
}