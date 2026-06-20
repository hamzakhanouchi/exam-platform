package com.exam.platform.controller;

import com.exam.platform.dto.request.QuestionRequest;
import com.exam.platform.dto.response.QuestionResponse;
import com.exam.platform.entity.Question;
import com.exam.platform.security.CustomUserDetails;
import com.exam.platform.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/exams/{examId}/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<QuestionResponse> addQuestion(@PathVariable Long examId,
                                                        @Valid @RequestBody QuestionRequest request,
                                                        @AuthenticationPrincipal CustomUserDetails currentUser) {
        Question question = questionService.addQuestion(examId, request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(question, true));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<QuestionResponse>> getQuestions(@PathVariable Long examId,
                                                               @AuthenticationPrincipal CustomUserDetails currentUser) {
        boolean includeCorrect = currentUser.getRole().name().equals("PROFESSOR") ||
                currentUser.getRole().name().equals("ADMIN");
        List<Question> questions = questionService.getQuestionsByExam(examId, false);
        List<QuestionResponse> responses = questions.stream()
                .map(q -> mapToResponse(q, includeCorrect))
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{questionId}")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<QuestionResponse> updateQuestion(@PathVariable Long examId,
                                                           @PathVariable Long questionId,
                                                           @Valid @RequestBody QuestionRequest request,
                                                           @AuthenticationPrincipal CustomUserDetails currentUser) {
        Question question = questionService.updateQuestion(questionId, request, currentUser.getId());
        return ResponseEntity.ok(mapToResponse(question, true));
    }

    @DeleteMapping("/{questionId}")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long examId,
                                            @PathVariable Long questionId,
                                            @AuthenticationPrincipal CustomUserDetails currentUser) {
        questionService.deleteQuestion(questionId, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    private QuestionResponse mapToResponse(Question q, boolean includeCorrect) {
        QuestionResponse.QuestionResponseBuilder builder = QuestionResponse.builder()
                .id(q.getId())
                .content(q.getContent())
                .optionA(q.getOptionA())
                .optionB(q.getOptionB())
                .optionC(q.getOptionC())
                .optionD(q.getOptionD())
                .points(q.getPoints());
        if (includeCorrect) {
            builder.correctAnswer(q.getCorrectAnswer());
        }
        return builder.build();
    }
}