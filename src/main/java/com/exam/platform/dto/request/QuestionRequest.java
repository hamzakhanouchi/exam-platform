// QuestionRequest.java
package com.exam.platform.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class QuestionRequest {
    @NotBlank
    private String content;
    @NotBlank
    private String optionA;
    @NotBlank
    private String optionB;
    @NotBlank
    private String optionC;
    @NotBlank
    private String optionD;
    @NotBlank
    private String correctAnswer; // A, B, C, D
    @NotNull
    private int points;
}