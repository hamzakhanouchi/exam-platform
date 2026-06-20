package com.exam.platform.repository;

import com.exam.platform.entity.SecurityLog;
import com.exam.platform.entity.User;   // ← AJOUT OBLIGATOIRE
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SecurityLogRepository extends JpaRepository<SecurityLog, Long> {

    @Query("SELECT sl FROM SecurityLog sl JOIN FETCH sl.user")
    List<SecurityLog> findAllWithUser();

    List<SecurityLog> findByUser(User user);
    List<SecurityLog> findByUserIn(List<User> users);
}