// ResultResponse.java
package com.exam.platform.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ResultResponse {
    private Long id;
    private String examTitle;
    private int score;
    private int totalPoints;
    private double percentage;
    private LocalDateTime submittedAt;
    private int tabSwitchCount;
    private int pasteAttemptCount;
}