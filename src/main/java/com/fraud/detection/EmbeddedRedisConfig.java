package com.fraud.detection;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.context.annotation.Configuration;
import redis.embedded.RedisServer;

import java.io.IOException;

/**
 * Starts an embedded Redis server on port 6370 when the application boots.
 * This eliminates the need for an external Redis install for development/demo.
 */
@Configuration
public class EmbeddedRedisConfig {

    private RedisServer redisServer;

    @PostConstruct
    public void startRedis() throws IOException {
        try {
            redisServer = RedisServer.newRedisServer()
                    .port(6370)
                    .build();
            redisServer.start();
            System.out.println("✅ Embedded Redis started on port 6370");
        } catch (Exception e) {
            System.err.println("⚠️ Embedded Redis could not start (may already be running): " + e.getMessage());
        }
    }

    @PreDestroy
    public void stopRedis() throws IOException {
        if (redisServer != null && redisServer.isActive()) {
            redisServer.stop();
            System.out.println("🛑 Embedded Redis stopped.");
        }
    }
}
