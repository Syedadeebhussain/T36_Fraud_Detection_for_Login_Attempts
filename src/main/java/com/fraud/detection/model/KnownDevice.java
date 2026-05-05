package com.fraud.detection.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "known_devices")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KnownDevice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String deviceId; // Fingerprint or User-Agent hash

    private String userAgent;

    private LocalDateTime lastSeen;
}
