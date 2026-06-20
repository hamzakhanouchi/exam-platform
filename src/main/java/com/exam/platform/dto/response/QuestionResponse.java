package com.exam.platform.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuestionResponse {
    private Long id;
    private String content;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private int points;
    private String correctAnswer; // null for students during exam
}