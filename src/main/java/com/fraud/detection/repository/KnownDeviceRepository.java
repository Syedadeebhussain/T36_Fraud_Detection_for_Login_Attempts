package com.fraud.detection.repository;

import com.fraud.detection.model.KnownDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface KnownDeviceRepository extends JpaRepository<KnownDevice, Long> {
    Optional<KnownDevice> findByUsernameAndDeviceId(String username, String deviceId);
}
