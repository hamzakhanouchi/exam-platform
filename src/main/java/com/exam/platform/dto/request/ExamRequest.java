// ExamRequest.java
package com.exam.platform.dto.request;

import com.exam.platform.enums.ExamStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExamRequest {
    @NotBlank
    private String title;
    private String description;
    @NotNull
    @Min(1)
    private int durationMinutes;
    private ExamStatus status;
    private boolean shuffleQuestions;
    @Min(1)
    private int maxAttempts;
    private LocalDateTime startDate;
    @Future
    private LocalDateTime endDate;
}
