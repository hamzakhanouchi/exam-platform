package com.exam.platform.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitResultResponse {
    private int score;
    private int totalPoints;
    private double percentage;
    private String examTitle;
    private Map<Long, String> correctAnswers;
    private LocalDateTime submittedAt;
}