package com.exam.platform.service;

import com.exam.platform.dto.request.ExamRequest;
import com.exam.platform.entity.Exam;

public interface ExamService {
    public Exam createExam(ExamRequest request, Long professorId);
}
