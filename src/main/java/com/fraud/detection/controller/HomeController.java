package com.fraud.detection.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, String> home() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Intelligent Fraud Detection Backend is running!");
        response.put("dashboard", "http://localhost:5173");
        return response;
    }
}
