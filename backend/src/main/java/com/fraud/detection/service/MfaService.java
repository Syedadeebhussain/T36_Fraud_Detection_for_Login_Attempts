package com.fraud.detection.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class MfaService {
    private final StringRedisTemplate redisTemplate;
    private final SecureRandom secureRandom = new SecureRandom();

    private static final String OTP_PREFIX = "otp:";
    private static final int OTP_EXPIRY_MINUTES = 5;

    public String generateOtp(String username) {
        String otp = String.format("%06d", secureRandom.nextInt(1000000));
        redisTemplate.opsForValue().set(OTP_PREFIX + username, otp, OTP_EXPIRY_MINUTES, TimeUnit.MINUTES);
        return otp;
    }

    public boolean verifyOtp(String username, String otp) {
        String storedOtp = redisTemplate.opsForValue().get(OTP_PREFIX + username);
        if (storedOtp != null && storedOtp.equals(otp)) {
            redisTemplate.delete(OTP_PREFIX + username);
            return true;
        }
        return false;
    }
}
