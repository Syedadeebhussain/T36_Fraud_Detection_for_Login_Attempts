package com.fraud.detection.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendSuspiciousLoginAlert(String toEmail, String username, String ip, String location, int riskScore) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("[ALERT] Suspicious Login Detected - " + username);
            message.setText(
                "⚠️ FRAUD DETECTION SYSTEM ALERT\n\n" +
                "We detected a suspicious login attempt for your account.\n\n" +
                "Details:\n" +
                "  Username:  " + username + "\n" +
                "  IP Address: " + ip + "\n" +
                "  Location:  " + location + "\n" +
                "  Risk Score: " + riskScore + "/100\n\n" +
                "If this was you, please verify your identity via MFA.\n" +
                "If not, please contact security immediately.\n\n" +
                "— Fraud Detection System"
            );
            if (mailSender != null) {
                mailSender.send(message);
            } else {
                System.out.println("Email notification skipped (no MailSender): " + message.getSubject());
            }
        } catch (Exception e) {
            // Log failure but do not crash the auth flow
            System.err.println("Email notification failed: " + e.getMessage());
        }
    }

    public void sendAccountLockAlert(String toEmail, String username) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("[SECURITY] Your Account Has Been Locked - " + username);
            message.setText(
                "🔒 ACCOUNT LOCKED\n\n" +
                "Your account has been temporarily locked due to high-risk login activity.\n\n" +
                "If this was you, please contact support to unlock your account.\n" +
                "If not, your account is safe — it has been locked to prevent unauthorized access.\n\n" +
                "— Fraud Detection System"
            );
            if (mailSender != null) {
                mailSender.send(message);
            } else {
                System.out.println("Email notification skipped (no MailSender): " + message.getSubject());
            }
        } catch (Exception e) {
            System.err.println("Email notification failed: " + e.getMessage());
        }
    }
}
