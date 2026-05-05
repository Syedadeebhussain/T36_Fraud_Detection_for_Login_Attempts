package com.fraud.detection.service;

import lombok.Data;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Random;

@Service
public class GeoLocationService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final Random random = new Random();

    @Data
    public static class GeoData {
        private String country;
        private String city;
        private String loc; // "lat,long"
    }

    public GeoData getGeoData(String ip) {
        // Mock offline simulation for demonstration
        if (ip.startsWith("192.168.") || ip.startsWith("10.") || ip.equals("127.0.0.1") || ip.equals("0:0:0:0:0:0:0:1")) {
            return getSimulatedData();
        }

        try {
            // Online lookup
            String url = "https://ipinfo.io/" + ip + "/json";
            return restTemplate.getForObject(url, GeoData.class);
        } catch (Exception e) {
            return getSimulatedData();
        }
    }

    private GeoData getSimulatedData() {
        // Return random interesting locations for the demo when offline
        String[][] locations = {
            {"USA", "San Francisco", "37.7749,-122.4194"},
            {"Germany", "Berlin", "52.5200,13.4050"},
            {"Japan", "Tokyo", "35.6762,139.6503"},
            {"UK", "London", "51.5074,-0.1278"},
            {"Brazil", "São Paulo", "-23.5505,-46.6333"}
        };
        
        int idx = random.nextInt(locations.length);
        GeoData mock = new GeoData();
        mock.setCountry(locations[idx][0]);
        mock.setCity(locations[idx][1]);
        mock.setLoc(locations[idx][2]);
        return mock;
    }
}
