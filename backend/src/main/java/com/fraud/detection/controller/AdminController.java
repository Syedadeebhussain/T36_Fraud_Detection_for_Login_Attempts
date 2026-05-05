package com.fraud.detection.controller;

import com.fraud.detection.model.LoginAttempt;
import com.fraud.detection.repository.LoginAttemptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {
    private final LoginAttemptRepository loginAttemptRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        List<LoginAttempt> all = loginAttemptRepository.findAll();
        Map<String, Long> statusCounts = all.stream()
                .collect(Collectors.groupingBy(LoginAttempt::getStatus, Collectors.counting()));

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAttempts", (long) all.size());
        stats.put("statusDistribution", statusCounts);
        stats.put("averageRiskScore", all.stream().mapToInt(LoginAttempt::getRiskScore).average().orElse(0.0));
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/incidents")
    public ResponseEntity<List<LoginAttempt>> getIncidents() {
        return ResponseEntity.ok(loginAttemptRepository.findTop10ByOrderByTimestampDesc());
    }

    @GetMapping("/map-data")
    public ResponseEntity<List<Map<String, Object>>> getMapData() {
        return ResponseEntity.ok(loginAttemptRepository.findAll().stream()
                .filter(a -> a.getLatitude() != null)
                .map(a -> {
                    Map<String, Object> point = new HashMap<>();
                    point.put("lat", a.getLatitude());
                    point.put("lng", a.getLongitude());
                    point.put("status", a.getStatus());
                    point.put("city", a.getCity());
                    return point;
                }).collect(Collectors.toList()));
    }
}
