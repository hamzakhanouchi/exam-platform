package com.exam.platform.service;

import com.exam.platform.dto.request.ExamRequest;
import com.exam.platform.dto.response.ExamResponse;
import com.exam.platform.dto.response.QuestionResponse;
import com.exam.platform.entity.Exam;
import com.exam.platform.entity.User;
import com.exam.platform.enums.ExamStatus;
import com.exam.platform.exception.ResourceNotFoundException;
import com.exam.platform.exception.UnauthorizedException;
import com.exam.platform.repository.ExamRepository;
import com.exam.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamServiceImpl {

    private final ExamRepository examRepository;
    private final UserRepository userRepository;

    public Exam createExam(ExamRequest request, Long professorId) {
        User professor = userRepository.findById(professorId)
                .orElseThrow(() -> new ResourceNotFoundException("Professor not found"));
        Exam exam = Exam.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .durationMinutes(request.getDurationMinutes())
                .status(request.getStatus() != null ? request.getStatus() : ExamStatus.DRAFT)
                .shuffleQuestions(request.isShuffleQuestions())
                .maxAttempts(request.getMaxAttempts())
                .professor(professor)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();
        return examRepository.save(exam);
    }

    public Exam updateExam(Long examId, ExamRequest request, Long professorId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
        if (!exam.getProfessor().getId().equals(professorId)) {
            throw new UnauthorizedException("You are not the owner of this exam");
        }
        exam.setTitle(request.getTitle());
        exam.setDescription(request.getDescription());
        exam.setDurationMinutes(request.getDurationMinutes());
        exam.setStatus(request.getStatus());
        exam.setShuffleQuestions(request.isShuffleQuestions());
        exam.setMaxAttempts(request.getMaxAttempts());
        exam.setStartDate(request.getStartDate());
        exam.setEndDate(request.getEndDate());
        return examRepository.save(exam);
    }

    public void updateExamStatus(Long examId, ExamStatus newStatus, Long professorId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
        if (!exam.getProfessor().getId().equals(professorId)) {
            throw new UnauthorizedException("You are not the owner of this exam");
        }
        exam.setStatus(newStatus);
        examRepository.save(exam);
    }

    public void deleteExam(Long examId, Long userId, boolean isAdmin) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
        if (!isAdmin && !exam.getProfessor().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to delete this exam");
        }
        examRepository.delete(exam);
    }

    public Exam getExamById(Long id) {
        return examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with id: " + id));
    }

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    public List<Exam> getExamsByProfessor(Long professorId) {
        User professor = userRepository.findById(professorId)
                .orElseThrow(() -> new ResourceNotFoundException("Professor not found"));
        return examRepository.findByProfessor(professor);
    }

    public List<Exam> getAvailableExams() {
        return examRepository.findAvailableExams(LocalDateTime.now());
    }

    public ExamResponse mapToResponse(Exam exam, boolean includeQuestions) {
        ExamResponse.ExamResponseBuilder builder = ExamResponse.builder()
                .id(exam.getId())
                .title(exam.getTitle())
                .description(exam.getDescription())
                .durationMinutes(exam.getDurationMinutes())
                .status(exam.getStatus())
                .shuffleQuestions(exam.isShuffleQuestions())
                .maxAttempts(exam.getMaxAttempts())
                .professorName(exam.getProfessor().getUsername())
                .startDate(exam.getStartDate())
                .endDate(exam.getEndDate());
        if (includeQuestions && exam.getQuestions() != null) {
            List<QuestionResponse> questionResponses = exam.getQuestions().stream()
                    .map(q -> QuestionResponse.builder()
                            .id(q.getId())
                            .content(q.getContent())
                            .optionA(q.getOptionA())
                            .optionB(q.getOptionB())
                            .optionC(q.getOptionC())
                            .optionD(q.getOptionD())
                            .points(q.getPoints())
                            .build())
                    .collect(Collectors.toList());
            builder.questions(questionResponses);
        }
        return builder.build();
    }
}