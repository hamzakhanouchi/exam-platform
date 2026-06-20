package com.exam.platform.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class SubmitAnswersRequest {
    @NotNull
    private Map<String, String> answers;  // ← IMPORTANT : Map<String, String>
}