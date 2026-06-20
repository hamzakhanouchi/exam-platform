// StudentResultRepository.java
package com.exam.platform.repository;

import com.exam.platform.entity.Exam;
import com.exam.platform.entity.StudentResult;
import com.exam.platform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentResultRepository extends JpaRepository<StudentResult, Long> {
    List<StudentResult> findByStudent(User student);
    List<StudentResult> findByExam(Exam exam);
    Optional<StudentResult> findByStudentAndExam(User student, Exam exam);
    @Query("SELECT AVG(sr.percentage) FROM StudentResult sr WHERE sr.exam = :exam")
    Double getAveragePercentageForExam(@Param("exam") Exam exam);
}