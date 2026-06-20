// ExamRepository.java
package com.exam.platform.repository;

import com.exam.platform.entity.Exam;
import com.exam.platform.entity.User;
import com.exam.platform.enums.ExamStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByProfessor(User professor);
    List<Exam> findByStatus(ExamStatus status);
    @Query("SELECT e FROM Exam e WHERE e.status = 'ACTIVE' AND e.startDate <= :now AND e.endDate >= :now")
    List<Exam> findAvailableExams(@Param("now") LocalDateTime now);
}