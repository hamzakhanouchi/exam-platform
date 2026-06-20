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
public class SessionResponse {
    private Long sessionId;
    private Long examId;
    private String examTitle;
    private LocalDateTime startedAt;
    private int durationMinutes;
    private boolean isCompleted;
    private int tabSwitchCount;
    private int pasteAttemptCount;
    private List<QuestionResponse> questions; // idem // idem
}