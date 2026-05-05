package com.fraud.detection.repository;

import com.fraud.detection.model.BlockedIP;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BlockedIPRepository extends JpaRepository<BlockedIP, Long> {
    Optional<BlockedIP> findByIpAddress(String ipAddress);
}
