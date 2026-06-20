package com.exam.platform.controller;

import com.exam.platform.dto.response.ResultResponse;
import com.exam.platform.security.CustomUserDetails;
import com.exam.platform.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<ResultResponse>> getMyResults(@AuthenticationPrincipal CustomUserDetails currentUser) {
        return ResponseEntity.ok(resultService.getMyResults(currentUser.getId()));
    }

    @GetMapping("/exam/{examId}")
    @PreAuthorize("hasAnyRole('PROFESSOR','ADMIN')")
    public ResponseEntity<List<ResultResponse>> getResultsForExam(@PathVariable Long examId,
                                                                  @AuthenticationPrincipal CustomUserDetails currentUser) {
        boolean isAdmin = currentUser.getRole().name().equals("ADMIN");
        return ResponseEntity.ok(resultService.getResultsForExam(examId, currentUser.getId(), isAdmin));
    }

    @GetMapping("/exam/{examId}/stats")
    @PreAuthorize("hasAnyRole('PROFESSOR','ADMIN')")
    public ResponseEntity<Map<String, Object>> getExamStats(@PathVariable Long examId,
                                                            @AuthenticationPrincipal CustomUserDetails currentUser) {
        boolean isAdmin = currentUser.getRole().name().equals("ADMIN");
        return ResponseEntity.ok(resultService.getExamStats(examId, currentUser.getId(), isAdmin));
    }
}