package com.exam.platform.service;

import com.exam.platform.dto.response.ResultResponse;
import com.exam.platform.entity.Exam;
import com.exam.platform.entity.StudentResult;
import com.exam.platform.entity.User;
import com.exam.platform.exception.ResourceNotFoundException;
import com.exam.platform.repository.ExamRepository;
import com.exam.platform.repository.StudentResultRepository;
import com.exam.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResultService {

    private final StudentResultRepository resultRepository;
    private final ExamRepository examRepository;
    private final UserRepository userRepository;

    public List<ResultResponse> getMyResults(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        return resultRepository.findByStudent(student).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ResultResponse> getResultsForExam(Long examId, Long professorId, boolean isAdmin) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
        if (!isAdmin && !exam.getProfessor().getId().equals(professorId)) {
            throw new RuntimeException("Access denied");
        }
        return resultRepository.findByExam(exam).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getExamStats(Long examId, Long professorId, boolean isAdmin) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
        if (!isAdmin && !exam.getProfessor().getId().equals(professorId)) {
            throw new RuntimeException("Access denied");
        }
        List<StudentResult> results = resultRepository.findByExam(exam);
        double avg = results.stream().mapToDouble(StudentResult::getPercentage).average().orElse(0);
        double min = results.stream().mapToDouble(StudentResult::getPercentage).min().orElse(0);
        double max = results.stream().mapToDouble(StudentResult::getPercentage).max().orElse(0);
        Map<String, Object> stats = new HashMap<>();
        stats.put("average", avg);
        stats.put("min", min);
        stats.put("max", max);
        stats.put("totalSubmissions", results.size());
        return stats;
    }

    private ResultResponse mapToResponse(StudentResult result) {
        return ResultResponse.builder()
                .id(result.getId())
                .examTitle(result.getExam().getTitle())
                .score(result.getScore())
                .totalPoints(result.getTotalPoints())
                .percentage(result.getPercentage())
                .submittedAt(result.getSubmittedAt())
                .tabSwitchCount(result.getSession() != null ? result.getSession().getTabSwitchCount() : 0)
                .pasteAttemptCount(result.getSession() != null ? result.getSession().getPasteAttemptCount() : 0)
                .build();
    }
}