// ExamSessionRepository.java
package com.exam.platform.repository;

import com.exam.platform.entity.Exam;
import com.exam.platform.entity.ExamSession;
import com.exam.platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamSessionRepository extends JpaRepository<ExamSession, Long> {
    List<ExamSession> findByStudentAndExam(User student, Exam exam);
    Optional<ExamSession> findByIdAndStudent(Long id, User student);
    List<ExamSession> findByExam(Exam exam);
}
