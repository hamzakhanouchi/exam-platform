package com.exam.platform.controller;

import com.exam.platform.dto.request.ExamRequest;
import com.exam.platform.dto.response.ExamResponse;
import com.exam.platform.entity.Exam;
import com.exam.platform.enums.ExamStatus;
import com.exam.platform.mapper.ExamMapper;
import com.exam.platform.security.CustomUserDetails;
import com.exam.platform.service.ExamServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamServiceImpl examService;
    private final ExamMapper examMapper; // ← injection MapStruct

    @PostMapping
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<ExamResponse> createExam(@Valid @RequestBody ExamRequest request,
                                                   @AuthenticationPrincipal CustomUserDetails currentUser) {
        Exam exam = examService.createExam(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(examMapper.toResponse(exam));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ExamResponse>> getAllExams() {
        List<Exam> exams = examService.getAllExams();
        return ResponseEntity.ok(examMapper.toResponseList(exams));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<List<ExamResponse>> getMyExams(@AuthenticationPrincipal CustomUserDetails currentUser) {
        List<Exam> exams = examService.getExamsByProfessor(currentUser.getId());
        return ResponseEntity.ok(examMapper.toResponseList(exams));
    }

    @GetMapping("/available")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<ExamResponse>> getAvailableExams() {
        List<Exam> exams = examService.getAvailableExams();
        return ResponseEntity.ok(examMapper.toResponseList(exams));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ExamResponse> getExamById(@PathVariable Long id,
                                                    @AuthenticationPrincipal CustomUserDetails currentUser) {
        Exam exam = examService.getExamById(id);
        // On peut ajouter la logique pour inclure ou non les questions (via un flag)
        ExamResponse response = examMapper.toResponse(exam);
        // Si l’utilisateur est prof ou admin, on ajoute les questions
        if (currentUser.getRole().name().equals("PROFESSOR") || currentUser.getRole().name().equals("ADMIN")) {
            // On peut charger les questions manuellement si besoin
        }
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<ExamResponse> updateExam(@PathVariable Long id,
                                                   @Valid @RequestBody ExamRequest request,
                                                   @AuthenticationPrincipal CustomUserDetails currentUser) {
        Exam exam = examService.updateExam(id, request, currentUser.getId());
        return ResponseEntity.ok(examMapper.toResponse(exam));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('PROFESSOR','ADMIN')")
    public ResponseEntity<?> deleteExam(@PathVariable Long id,
                                        @AuthenticationPrincipal CustomUserDetails currentUser) {
        boolean isAdmin = currentUser.getRole().name().equals("ADMIN");
        examService.deleteExam(id, currentUser.getId(), isAdmin);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<?> updateExamStatus(@PathVariable Long id,
                                              @RequestParam ExamStatus status,
                                              @AuthenticationPrincipal CustomUserDetails currentUser) {
        examService.updateExamStatus(id, status, currentUser.getId());
        return ResponseEntity.ok().build();
    }
}