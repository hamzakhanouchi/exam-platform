package com.exam.platform.config;

import com.exam.platform.entity.*;
import com.exam.platform.enums.ExamStatus;
import com.exam.platform.enums.Role;
import com.exam.platform.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j  // ← AJOUTÉ
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ExamRepository examRepository;
    private final QuestionRepository questionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // ← AJOUTÉ : vérification pour ne pas réinitialiser
        if (userRepository.count() > 0) {
            log.info("✅ Données déjà présentes, initialisation ignorée.");
            return;
        }

        log.info("🚀 Initialisation des données de démonstration...");

        // Admin
        User admin = User.builder()
                .username("admin")
                .email("admin@exam.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .enabled(true)
                .build();
        userRepository.save(admin);

        // Professor
        User professor = User.builder()
                .username("prof")
                .email("prof@exam.com")
                .password(passwordEncoder.encode("prof123"))
                .role(Role.PROFESSOR)
                .enabled(true)
                .build();
        userRepository.save(professor);

        // Students
        User student1 = User.builder()
                .username("student1")
                .email("student1@exam.com")
                .password(passwordEncoder.encode("student123"))
                .role(Role.STUDENT)
                .enabled(true)
                .build();
        User student2 = User.builder()
                .username("student2")
                .email("student2@exam.com")
                .password(passwordEncoder.encode("student123"))
                .role(Role.STUDENT)
                .enabled(true)
                .build();
        userRepository.save(student1);
        userRepository.save(student2);

        // Active exam with 5 questions
        Exam exam = Exam.builder()
                .title("Java Basics Exam")
                .description("Test your knowledge of Java fundamentals")
                .durationMinutes(30)
                .status(ExamStatus.ACTIVE)
                .shuffleQuestions(true)
                .maxAttempts(2)
                .professor(professor)
                .startDate(LocalDateTime.now().minusHours(1))
                .endDate(LocalDateTime.now().plusDays(7))
                .build();
        examRepository.save(exam);

        // Add questions
        Question q1 = Question.builder()
                .content("What is the size of int in Java?")
                .optionA("16 bits")
                .optionB("32 bits")
                .optionC("64 bits")
                .optionD("Depends on platform")
                .correctAnswer("B")
                .points(2)
                .exam(exam)
                .build();
        Question q2 = Question.builder()
                .content("Which keyword is used to inherit a class in Java?")
                .optionA("implement")
                .optionB("extends")
                .optionC("inherit")
                .optionD("super")
                .correctAnswer("B")
                .points(2)
                .exam(exam)
                .build();
        Question q3 = Question.builder()
                .content("What does JVM stand for?")
                .optionA("Java Variable Machine")
                .optionB("Java Virtual Machine")
                .optionC("Java Visual Machine")
                .optionD("Just Virtual Machine")
                .correctAnswer("B")
                .points(2)
                .exam(exam)
                .build();
        Question q4 = Question.builder()
                .content("Which collection maintains insertion order?")
                .optionA("HashSet")
                .optionB("HashMap")
                .optionC("LinkedHashSet")
                .optionD("TreeSet")
                .correctAnswer("C")
                .points(2)
                .exam(exam)
                .build();
        Question q5 = Question.builder()
                .content("What is the default value of a boolean variable in Java?")
                .optionA("true")
                .optionB("false")
                .optionC("null")
                .optionD("0")
                .correctAnswer("B")
                .points(2)
                .exam(exam)
                .build();
        questionRepository.save(q1);
        questionRepository.save(q2);
        questionRepository.save(q3);
        questionRepository.save(q4);
        questionRepository.save(q5);

        log.info("✅ Initialisation terminée.");
    }
}