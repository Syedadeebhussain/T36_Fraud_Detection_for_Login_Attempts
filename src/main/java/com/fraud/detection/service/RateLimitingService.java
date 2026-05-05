package com.fraud.detection.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RateLimitingService {
    private final StringRedisTemplate redisTemplate;

    private static final String LOGIN_ATTEMPT_PREFIX = "login_attempt:";
    private static final int MAX_ATTEMPTS = 5;
    private static final int WINDOW_MINUTES = 1;

    public boolean isAllowed(String ip) {
        String key = LOGIN_ATTEMPT_PREFIX + ip;
        String countStr = redisTemplate.opsForValue().get(key);
        
        if (countStr == null) {
            redisTemplate.opsForValue().set(key, "1", WINDOW_MINUTES, TimeUnit.MINUTES);
            return true;
        }

        int count = Integer.parseInt(countStr);
        if (count >= MAX_ATTEMPTS) {
            return false;
        }

        redisTemplate.opsForValue().increment(key);
        return true;
    }

    public void reset(String ip) {
        redisTemplate.delete(LOGIN_ATTEMPT_PREFIX + ip);
    }
}
