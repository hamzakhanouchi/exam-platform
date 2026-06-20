// AnswerSubmitRequest.java
package com.exam.platform.dto.request;

import lombok.Data;

import java.util.Map;

@Data
public class AnswerSubmitRequest {
    private Map<Long, String> answers; // questionId -> selectedOption (A/B/C/D)
}