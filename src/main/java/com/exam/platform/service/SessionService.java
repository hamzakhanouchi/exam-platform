package com.exam.platform.service;

import com.exam.platform.dto.request.SubmitAnswersRequest;
import com.exam.platform.dto.response.SubmitResultResponse;
import com.exam.platform.entity.*;
import com.exam.platform.enums.ExamStatus;
import com.exam.platform.exception.BadRequestException;
import com.exam.platform.exception.ConflictException;
import com.exam.platform.exception.ResourceNotFoundException;
import com.exam.platform.exception.UnauthorizedException;
import com.exam.platform.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SessionService {

    private final ExamSessionRepository sessionRepository;
    private final ExamRepository examRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final StudentResultRepository resultRepository;

    @Transactional
    public ExamSession startExam(Long examId, Long studentId) {
        log.debug("Démarrage de l'examen {} par l'étudiant {}", examId, studentId);

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        if (exam.getStatus() != ExamStatus.ACTIVE) {
            throw new BadRequestException("Exam is not active");
        }

        LocalDateTime now = LocalDateTime.now();
        if (exam.getStartDate() != null && now.isBefore(exam.getStartDate())) {
            throw new BadRequestException("Exam has not started yet");
        }
        if (exam.getEndDate() != null && now.isAfter(exam.getEndDate())) {
            throw new BadRequestException("Exam has already ended");
        }

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        List<ExamSession> previousSessions = sessionRepository.findByStudentAndExam(student, exam);
        long completedAttempts = previousSessions.stream().filter(ExamSession::isCompleted).count();
        if (completedAttempts >= exam.getMaxAttempts()) {
            throw new ConflictException("Maximum attempts reached for this exam");
        }

        ExamSession session = ExamSession.builder()
                .student(student)
                .exam(exam)
                .startedAt(now)
                .isCompleted(false)
                .tabSwitchCount(0)
                .pasteAttemptCount(0)
                .build();

        ExamSession saved = sessionRepository.save(session);
        log.info("Session créée avec l'ID : {}", saved.getId());
        return saved;
    }

    @Transactional
    public SubmitResultResponse submitExam(Long sessionId, Long studentId, SubmitAnswersRequest request) {
        log.debug("Soumission de la session {} par l'étudiant {}", sessionId, studentId);

        ExamSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        if (!session.getStudent().getId().equals(studentId)) {
            throw new UnauthorizedException("Access denied");
        }
        if (session.isCompleted()) {
            throw new ConflictException("Exam already submitted");
        }

        Exam exam = session.getExam();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime deadline = session.getStartedAt().plusMinutes(exam.getDurationMinutes());
        if (now.isAfter(deadline)) {
            throw new BadRequestException("Time limit exceeded");
        }

        List<Question> questions = questionRepository.findByExam(exam);

        // Récupération des réponses envoyées
        Map<String, String> stringAnswerMap = request.getAnswers();
        if (stringAnswerMap == null) {
            throw new BadRequestException("No answers provided");
        }

        // Conversion des clés String -> Long
        Map<Long, String> answerMap = new HashMap<>();
        for (Map.Entry<String, String> entry : stringAnswerMap.entrySet()) {
            try {
                answerMap.put(Long.valueOf(entry.getKey()), entry.getValue());
            } catch (NumberFormatException e) {
                log.error("ID de question invalide : {}", entry.getKey());
                throw new BadRequestException("Invalid question ID format: " + entry.getKey());
            }
        }

        int totalScore = 0;
        int totalPoints = 0;
        Map<Long, String> correctAnswersMap = new HashMap<>();

        for (Question q : questions) {
            totalPoints += q.getPoints();
            correctAnswersMap.put(q.getId(), q.getCorrectAnswer());
            String studentAnswer = answerMap.get(q.getId());
            if (studentAnswer != null && studentAnswer.equalsIgnoreCase(q.getCorrectAnswer())) {
                totalScore += q.getPoints();
            }
        }

        double percentage = (totalPoints > 0) ? (totalScore * 100.0 / totalPoints) : 0;

        StudentResult result = StudentResult.builder()
                .student(session.getStudent())
                .exam(exam)
                .score(totalScore)
                .totalPoints(totalPoints)
                .percentage(percentage)
                .submittedAt(now)
                .session(session)
                .build();

        session.setCompleted(true);
        session.setFinishedAt(now);
        sessionRepository.save(session);
        resultRepository.save(result);

        log.info("Soumission réussie – Score : {} / {}", totalScore, totalPoints);

        return SubmitResultResponse.builder()
                .score(totalScore)
                .totalPoints(totalPoints)
                .percentage(percentage)
                .examTitle(exam.getTitle())
                .correctAnswers(correctAnswersMap)
                .submittedAt(now)
                .build();
    }

    public ExamSession getSession(Long sessionId, Long studentId) {
        ExamSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        if (!session.getStudent().getId().equals(studentId)) {
            throw new UnauthorizedException("Access denied");
        }
        return session;
    }
}