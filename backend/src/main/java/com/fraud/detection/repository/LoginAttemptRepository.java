package com.fraud.detection.repository;

import com.fraud.detection.model.LoginAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoginAttemptRepository extends JpaRepository<LoginAttempt, Long> {
    List<LoginAttempt> findByUsernameOrderByTimestampDesc(String username);
    List<LoginAttempt> findTop10ByOrderByTimestampDesc();
}
