package com.exam.platform.service;

import com.exam.platform.entity.Exam;
import com.exam.platform.entity.SecurityLog;
import com.exam.platform.entity.User;
import com.exam.platform.exception.ResourceNotFoundException;
import com.exam.platform.repository.ExamRepository;
import com.exam.platform.repository.SecurityLogRepository;
import com.exam.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SecurityLogService {

    private final SecurityLogRepository logRepository;
    private final UserRepository userRepository;
    private final ExamRepository examRepository;

    public SecurityLog createLog(Long userId, String eventType, String details) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        SecurityLog log = SecurityLog.builder()
                .user(user)
                .eventType(eventType)
                .details(details)
                .timestamp(LocalDateTime.now())
                .build();
        return logRepository.save(log);
    }

    public List<SecurityLog> getAllLogs() {
        return logRepository.findAll();
    }

    public List<SecurityLog> getLogsByExam(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
        // Get all students who took this exam
        List<User> students = exam.getResults().stream().map(r -> r.getStudent()).distinct().toList();
        return logRepository.findByUserIn(students);
    }

    public List<SecurityLog> getLogsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return logRepository.findByUser(user);
    }
}