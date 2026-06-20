// QuestionRepository.java
package com.exam.platform.repository;

import com.exam.platform.entity.Exam;
import com.exam.platform.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByExam(Exam exam);
    void deleteByExam(Exam exam);
}
