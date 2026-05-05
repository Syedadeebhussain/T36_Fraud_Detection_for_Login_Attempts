package com.fraud.detection.service;

import com.fraud.detection.risk.RiskScore;
import lombok.Data;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class RiskEngineService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String ML_SERVICE_URL = "http://127.0.0.1:5000/analyze";

    @Data
    static class MLEvent {
        private int riskScore;
        private int hourOfDay;
        private int dayOfWeek;
        private int isNewDevice;
        private int isNewLocation;
    }

    @Data
    static class MLResponse {
        private double anomalyScore;
        private String prediction;
    }

    public RiskScore evaluate(String username, String ip, String userAgent, GeoLocationService.GeoData geo) {
        int score = 0;
        List<String> reasons = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        // 1. Basic Rule Checks
        if (isSuspiciousLocation(geo)) { 
            score += 40; 
            reasons.add("New/Suspicious Location"); 
        }
        
        if (isImpossibleTravel(username, geo)) { 
            score += 60; 
            reasons.add("Impossible Travel Detected"); 
        }

        // 2. AI-Driven Anomaly Detection (Calling ml-service)
        try {
            MLEvent event = new MLEvent();
            event.setRiskScore(score);
            event.setHourOfDay(now.getHour());
            event.setDayOfWeek(now.getDayOfWeek().getValue());
            event.setIsNewLocation(isSuspiciousLocation(geo) ? 1 : 0);
            event.setIsNewDevice(0); // For demo, assume not new device yet
            
            MLResponse mlRes = restTemplate.postForObject(ML_SERVICE_URL, event, MLResponse.class);
            if (mlRes != null && mlRes.getAnomalyScore() > 0.8) {
                score += 30;
                reasons.add("AI detected behavioral anomaly (" + mlRes.getPrediction() + ")");
            }
        } catch (Exception e) {
            // Service might be truly offline, proceed with rule-based only
            System.err.println("ML Service unreachable: " + e.getMessage());
        }

        return new RiskScore(Math.min(score, 100), reasons);
    }
    
    private boolean isSuspiciousLocation(GeoLocationService.GeoData geo) {
        return geo != null && !"Local".equals(geo.getCountry()) && !"Unknown".equals(geo.getCountry());
    }

    private boolean isImpossibleTravel(String username, GeoLocationService.GeoData geo) {
        // Mock logic for demo purposes
        return "admin".equals(username) && geo != null && "VPN".equals(geo.getCity());
    }
}
