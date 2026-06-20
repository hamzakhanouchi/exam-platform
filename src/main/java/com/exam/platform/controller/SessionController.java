package com.exam.platform.controller;

import com.exam.platform.dto.request.SubmitAnswersRequest;
import com.exam.platform.dto.response.*;
import com.exam.platform.entity.Exam;
import com.exam.platform.entity.ExamSession;
import com.exam.platform.entity.Question;
import com.exam.platform.mapper.QuestionMapper;
import com.exam.platform.mapper.SessionMapper;
import com.exam.platform.security.CustomUserDetails;
import com.exam.platform.service.ExamServiceImpl;
import com.exam.platform.service.QuestionService;
import com.exam.platform.service.SessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
@Slf4j
public class SessionController {

    private final SessionService sessionService;
    private final ExamServiceImpl examService;
    private final QuestionService questionService;
    private final SessionMapper sessionMapper;
    private final QuestionMapper questionMapper;

    @PostMapping("/start/{examId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<SessionStartResponse> startExam(@PathVariable Long examId,
                                                          @AuthenticationPrincipal CustomUserDetails currentUser) {
        log.debug("Démarrage d'examen pour l'étudiant {} sur l'examen {}", currentUser.getId(), examId);

        ExamSession session = sessionService.startExam(examId, currentUser.getId());
        Exam exam = examService.getExamById(examId);
        List<Question> questions = questionService.getQuestionsByExam(examId, exam.isShuffleQuestions());

        // Construction de la réponse via le mapper (déjà bien configuré)
        SessionStartResponse response = sessionMapper.toStartResponse(session);
        // Ajout des questions
        List<QuestionResponse> questionResponses = questionMapper.toResponseList(questions);
        response.setQuestions(questionResponses);

        log.info("Session créée avec ID : {}", response.getSessionId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{sessionId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<SessionResponse> getSession(@PathVariable Long sessionId,
                                                      @AuthenticationPrincipal CustomUserDetails currentUser) {
        log.debug("Récupération de la session {} pour l'étudiant {}", sessionId, currentUser.getId());

        ExamSession session = sessionService.getSession(sessionId, currentUser.getId());
        Exam exam = session.getExam();
        List<Question> questions = questionService.getQuestionsByExam(exam.getId(), exam.isShuffleQuestions());

        SessionResponse response = sessionMapper.toResponse(session);
        List<QuestionResponse> questionResponses = questionMapper.toResponseList(questions);
        response.setQuestions(questionResponses);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/submit/{sessionId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<SubmitResultResponse> submitExam(@PathVariable Long sessionId,
                                                           @RequestBody SubmitAnswersRequest request,
                                                           @AuthenticationPrincipal CustomUserDetails currentUser) {
        log.debug("Soumission de la session {} par l'étudiant {}", sessionId, currentUser.getId());

        SubmitResultResponse response = sessionService.submitExam(sessionId, currentUser.getId(), request);
        return ResponseEntity.ok(response);
    }
}