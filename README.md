# 🔐 Fraud Detection for Login Attempts

An intelligent authentication system that goes beyond passwords by analyzing login behavior, device, and location to detect suspicious activity in real-time.

---

## 📌 Overview

Traditional authentication systems rely only on usernames and passwords, making them vulnerable to attacks like:

- Brute Force Attacks  
- Credential Stuffing  
- Bot-based Login Attempts  

This project introduces a **Risk-Based Authentication System** that evaluates each login attempt using contextual metadata and assigns a **Risk Score (0–100)**.

---

## 🎯 Problem Statement

A system that blindly accepts correct credentials without analyzing login context (IP, location, device, behavior) is highly vulnerable.

We aim to:
- Detect malicious login attempts  
- Differentiate real users vs attackers  
- Trigger appropriate security actions  

---

## 🚀 Features

### ✅ Smart Risk-Based Authentication
- Assigns risk score to every login attempt
- Categories:
  - 🟢 **0–30 (Safe)** → Direct login  
  - 🟡 **31–70 (Warning)** → OTP verification  
  - 🔴 **71–100 (Critical)** → Block + Alert  

### 🌍 Geolocation Tracking
- Detect login location using IP
- Identify impossible travel scenarios  

### ⚡ Velocity Checks
- Detect rapid login attempts
- Prevent brute force attacks  

### 📧 Security Alerts
- Email notifications for suspicious logins  

### 📊 Admin Dashboard
- Live threat monitoring  
- Incident logs  
- Configurable rules  

---

## 👥 User Roles & Flow

### 👤 End User
- Low Risk → Login successful  
- Medium Risk → OTP required  
- High Risk → Account locked  

### 🛡️ Admin (Security Analyst)
- Live Threat Map  
- Incident Logs  
- Rule Configuration  

---

## 🧠 System Architecture

Frontend (React / HTML)  
↓  
Backend (Spring Boot + Spring Security)  
↓  
Risk Engine (Rule-Based / ML)  
↓  
Redis (Rate Limiting & Caching)  
↓  
External APIs (Geolocation, Device Info)  

---

## ⚙️ Tech Stack

### 💻 Frontend
- HTML / CSS / JavaScript / React  

### 🔧 Backend
- Java + Spring Boot  
- Spring Security  
- Spring Boot Actuator  

### ⚡ Data & Caching
- Redis  

### 🌍 APIs
- ipinfo.io / MaxMind  
- UAParser  

### 🤖 Optional ML
- Python (Scikit-learn – Isolation Forest)  

---

## 🧩 Core Components

- Metadata Capture (IP, User-Agent, Timestamp)  
- Risk Engine (Score: 0–100)  
- Velocity Checker  
- Notification Service (Email Alerts)  

---

## 🧪 Hackathon Demonstration

### ✔ Normal Flow
Login from known device → Instant access  

### 🌐 Attack Simulation
Login using VPN → OTP triggered  

### 🔁 Brute Force Simulation
Multiple wrong attempts → IP blocked  

### 📊 Admin Dashboard
Visualize safe vs suspicious traffic  

---

## 📈 Evaluation Criteria

| Category | Weight |
|----------|--------|
| Detection Logic | 30% |
| Dashboard | 20% |
| Response Mechanism | 20% |
| Performance | 15% |
| Innovation | 15% |

---

## 🎯 Outcome

A proactive security system that:
- Prevents account takeover  
- Enhances user security  
- Uses contextual intelligence instead of static passwords  

---

## 💡 Future Enhancements

- Behavioral biometrics  
- AI-based anomaly detection  
- Advanced device fingerprinting  
- OAuth / Social login integration  

---

## 🤝 Contributors

- Adeeb (Team Lead)  
- Ishu  
- Achintya  
- Kirti  

---

## 📜 License

This project is for hackathon/demo purposes.
