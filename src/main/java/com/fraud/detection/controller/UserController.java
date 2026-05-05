package com.fraud.detection.controller;

import com.fraud.detection.model.KnownDevice;
import com.fraud.detection.model.LoginAttempt;
import com.fraud.detection.repository.KnownDeviceRepository;
import com.fraud.detection.repository.LoginAttemptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    private final LoginAttemptRepository loginAttemptRepository;
    private final KnownDeviceRepository knownDeviceRepository;

    @GetMapping("/activity")
    public ResponseEntity<List<LoginAttempt>> getActivity(@RequestParam String username) {
        return ResponseEntity.ok(loginAttemptRepository.findByUsernameOrderByTimestampDesc(username));
    }

    @GetMapping("/devices")
    public ResponseEntity<List<KnownDevice>> getDevices(@RequestParam String username) {
        // Need to add findByUsername to KnownDeviceRepository
        // For now, I'll return all for the user if I add the method
        return ResponseEntity.ok(knownDeviceRepository.findAll().stream()
                .filter(d -> d.getUsername().equals(username))
                .toList());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(@RequestParam String username) {
        List<LoginAttempt> userAttempts = loginAttemptRepository.findByUsernameOrderByTimestampDesc(username);
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalLogins", userAttempts.size());
        stats.put("mfaCount", userAttempts.stream().filter(a -> a.getStatus().equals("MFA_REQUIRED")).count());
        stats.put("lastLogin", userAttempts.isEmpty() ? "Never" : userAttempts.get(0).getTimestamp());
        return ResponseEntity.ok(stats);
    }
}
