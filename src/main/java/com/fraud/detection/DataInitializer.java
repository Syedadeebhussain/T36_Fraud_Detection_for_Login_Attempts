package com.fraud.detection;

import com.fraud.detection.model.User;
import com.fraud.detection.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("password123"))
                    .email("admin@fraud-detection.com")
                    .role("ROLE_ADMIN")
                    .accountLocked(false)
                    .mfaEnabled(true)
                    .build();
            userRepository.save(admin);
            System.out.println("Admin user created: admin / password123");
        }

        if (userRepository.findByUsername("user").isEmpty()) {
            User user = User.builder()
                    .username("user")
                    .password(passwordEncoder.encode("password123"))
                    .email("user@example.com")
                    .role("ROLE_USER")
                    .accountLocked(false)
                    .mfaEnabled(true)
                    .build();
            userRepository.save(user);
            System.out.println("Regular user created: user / password123");
        }
    }
}
