package com.fraud.detection.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String status; // SUCCESS, MFA_REQUIRED, BLOCKED
    private Integer riskScore;
    private List<String> reasons;
    private String username;
    private String role;
}
