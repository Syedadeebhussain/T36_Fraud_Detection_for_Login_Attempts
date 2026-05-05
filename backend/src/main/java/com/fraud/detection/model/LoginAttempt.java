package com.fraud.detection.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "login_attempts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String ipAddress;

    private String userAgent;

    private String country;

    private String city;

    private Double latitude;

    private Double longitude;

    private LocalDateTime timestamp;

    private Integer riskScore;

    private String riskReasons;

    private String status; // SUCCESS, FAILED, MFA_REQUIRED, BLOCKED
}
