package com.fraud.detection.service;

import com.fraud.detection.dto.AuthResponse;
import com.fraud.detection.model.KnownDevice;
import com.fraud.detection.model.LoginAttempt;
import com.fraud.detection.model.User;
import com.fraud.detection.repository.KnownDeviceRepository;
import com.fraud.detection.repository.LoginAttemptRepository;
import com.fraud.detection.repository.UserRepository;
import com.fraud.detection.risk.RiskScore;
import com.fraud.detection.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final LoginAttemptRepository loginAttemptRepository;
    private final KnownDeviceRepository knownDeviceRepository;
    private final RiskEngineService riskEngineService;
    private final GeoLocationService geoLocationService;
    private final MfaService mfaService;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final UserDetailsService userDetailsService;

    public AuthResponse login(String username, String password, String ip, String userAgent) {
        User user = userRepository.findByUsername(username).orElse(null);

        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            recordAttempt(username, ip, userAgent, null, 100, "Invalid credentials", "FAILED");
            return AuthResponse.builder().status("FAILED").build();
        }

        if (user.isAccountLocked()) {
            return AuthResponse.builder()
                    .status("BLOCKED")
                    .reasons(Collections.singletonList("Account is temporarily locked"))
                    .build();
        }

        GeoLocationService.GeoData geoData = geoLocationService.getGeoData(ip);
        RiskScore risk = riskEngineService.evaluate(username, ip, userAgent, geoData);

        String status;
        String token = null;

        if (risk.getScore() >= 71) {
            status = "BLOCKED";
            lockAccount(user);
        } else {
            // MFA DISABLED FOR DEMO - Direct Success
            status = "SUCCESS";
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            token = jwtProvider.generateToken(userDetails);
            registerDevice(username, userAgent);
        }

        recordAttempt(username, ip, userAgent, geoData, risk.getScore(), String.join(", ", risk.getReasons()), status);

        return AuthResponse.builder()
                .token(token)
                .status(status)
                .riskScore(risk.getScore())
                .reasons(risk.getReasons())
                .username(username)
                .role(user.getRole())
                .build();
    }

    public AuthResponse verifyMfa(String username, String otp) {
        if (mfaService.verifyOtp(username, otp)) {
            User user = userRepository.findByUsername(username).orElse(null);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            String token = jwtProvider.generateToken(userDetails);
            return AuthResponse.builder()
                    .token(token)
                    .status("SUCCESS")
                    .username(username)
                    .role(user != null ? user.getRole() : "ROLE_USER")
                    .build();
        }
        return AuthResponse.builder()
                .status("FAILED")
                .reasons(Collections.singletonList("Invalid or expired OTP"))
                .build();
    }

    private void registerDevice(String username, String userAgent) {
        if (knownDeviceRepository.findByUsernameAndDeviceId(username, userAgent).isEmpty()) {
            KnownDevice device = KnownDevice.builder()
                    .username(username)
                    .deviceId(userAgent)
                    .userAgent(userAgent)
                    .lastSeen(LocalDateTime.now())
                    .build();
            knownDeviceRepository.save(device);
        }
    }

    private void recordAttempt(String username, String ip, String userAgent,
                               GeoLocationService.GeoData geo, int score, String reasons, String status) {
        LoginAttempt attempt = LoginAttempt.builder()
                .username(username)
                .ipAddress(ip)
                .userAgent(userAgent)
                .timestamp(LocalDateTime.now())
                .riskScore(score)
                .riskReasons(reasons)
                .status(status)
                .country("Unknown")
                .city("Unknown")
                .build();

        if (geo != null) {
            attempt.setCountry(geo.getCountry() != null ? geo.getCountry() : "Unknown");
            attempt.setCity(geo.getCity() != null ? geo.getCity() : "Unknown");
            if (geo.getLoc() != null) {
                String[] coords = geo.getLoc().split(",");
                if (coords.length == 2) {
                    try {
                        attempt.setLatitude(Double.parseDouble(coords[0].trim()));
                        attempt.setLongitude(Double.parseDouble(coords[1].trim()));
                    } catch (NumberFormatException ignored) { }
                }
            }
        }

        loginAttemptRepository.save(attempt);
    }

    private void lockAccount(User user) {
        user.setAccountLocked(true);
        user.setLockTime(LocalDateTime.now());
        userRepository.save(user);
    }
}
