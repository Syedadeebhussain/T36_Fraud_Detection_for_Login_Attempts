package com.fraud.detection.controller;

import com.fraud.detection.dto.AuthResponse;
import com.fraud.detection.dto.LoginRequest;
import com.fraud.detection.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request, HttpServletRequest servletRequest) {
        String ip = servletRequest.getRemoteAddr();
        String userAgent = servletRequest.getHeader("User-Agent");
        return ResponseEntity.ok(authService.login(request.getUsername(), request.getPassword(), ip, userAgent));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestParam String username, @RequestParam String otp) {
        return ResponseEntity.ok(authService.verifyMfa(username, otp));
    }
}
