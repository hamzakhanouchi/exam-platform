// ExamResponse.java
package com.exam.platform.dto.response;

import com.exam.platform.enums.ExamStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ExamResponse {
    private Long id;
    private String title;
    private String description;
    private int durationMinutes;
    private ExamStatus status;
    private boolean shuffleQuestions;
    private int maxAttempts;
    private String professorName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private List<QuestionResponse> questions; // null for list views
}
