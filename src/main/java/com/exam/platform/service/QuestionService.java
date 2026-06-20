package com.exam.platform.service;

import com.exam.platform.dto.request.QuestionRequest;
import com.exam.platform.entity.Exam;
import com.exam.platform.entity.Question;
import com.exam.platform.exception.ResourceNotFoundException;
import com.exam.platform.exception.UnauthorizedException;
import com.exam.platform.repository.ExamRepository;
import com.exam.platform.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final ExamRepository examRepository;

    public Question addQuestion(Long examId, QuestionRequest request, Long professorId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
        if (!exam.getProfessor().getId().equals(professorId)) {
            throw new UnauthorizedException("You are not the owner of this exam");
        }
        Question question = Question.builder()
                .content(request.getContent())
                .optionA(request.getOptionA())
                .optionB(request.getOptionB())
                .optionC(request.getOptionC())
                .optionD(request.getOptionD())
                .correctAnswer(request.getCorrectAnswer())
                .points(request.getPoints())
                .exam(exam)
                .build();
        return questionRepository.save(question);
    }

    public Question updateQuestion(Long questionId, QuestionRequest request, Long professorId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
        if (!question.getExam().getProfessor().getId().equals(professorId)) {
            throw new UnauthorizedException("You are not the owner of this exam");
        }
        question.setContent(request.getContent());
        question.setOptionA(request.getOptionA());
        question.setOptionB(request.getOptionB());
        question.setOptionC(request.getOptionC());
        question.setOptionD(request.getOptionD());
        question.setCorrectAnswer(request.getCorrectAnswer());
        question.setPoints(request.getPoints());
        return questionRepository.save(question);
    }

    public void deleteQuestion(Long questionId, Long professorId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
        if (!question.getExam().getProfessor().getId().equals(professorId)) {
            throw new UnauthorizedException("You are not the owner of this exam");
        }
        questionRepository.delete(question);
    }

    public List<Question> getQuestionsByExam(Long examId, boolean shuffle) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
        List<Question> questions = questionRepository.findByExam(exam);
        if (shuffle) {
            java.util.Collections.shuffle(questions);
        }
        return questions;
    }
}