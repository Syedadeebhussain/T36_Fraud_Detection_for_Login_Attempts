# 🛡️ Intelligent Fraud Detection Authentication System

A production-ready, full-stack authentication system with **real-time risk scoring**, **adaptive MFA**, and an **admin threat intelligence dashboard**.

## Architecture

```
fraud-detection/
├── backend/            # Spring Boot 3.x (Java 17)
├── frontend/           # React + Vite (TypeScript)
├── ml-service/         # Python FastAPI + Scikit-learn
└── docker-compose.yml  # PostgreSQL 15 + Redis 7
```

## Tech Stack

| Layer       | Technology                              |
|-------------|------------------------------------------|
| Backend     | Spring Boot 3, Spring Security, JPA, JWT |
| Database    | PostgreSQL                               |
| Cache       | Redis (rate limiting + OTP storage)      |
| Frontend    | React, Vite, Recharts, Leaflet           |
| ML Service  | FastAPI, Scikit-learn (IsolationForest)  |
| Email       | Spring Mail                              |

---

## 🚀 Quick Start

### Prerequisites

- **Java 17+** and **Maven 3.9+**
- **Node.js 18+** and **npm**
- **Python 3.10+**
- **Docker & Docker Compose**

---

### Step 1: Start Infrastructure

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port `5432`
- Redis on port `6379`

---

### Step 2: Start the Backend

```bash
cd backend
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`.

> **Note:** Configure email in `src/main/resources/application.properties`.
> A default user `admin / password123` is seeded automatically on first run.

---

### Step 3: Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The UI will be available at `http://localhost:5173`.

---

### Step 4: (Optional) Start the ML Service

```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

The ML API will be available at `http://localhost:5000`.

---

## 🔐 Risk Engine Rules

| Rule                | Score Added | Trigger                                 |
|---------------------|-------------|------------------------------------------|
| New Device          | +25         | User-Agent not seen before               |
| New Location        | +30         | Login from different country             |
| Impossible Travel   | +50         | Speed between logins > 800 km/h          |
| Rapid Attempts      | +40         | >5 login attempts within 1 minute        |
| Blacklisted IP      | +50         | IP is in `blocked_ips` table             |

### Score Interpretation

| Score   | Action                                         |
|---------|------------------------------------------------|
| 0–30    | ✅ Allow login immediately                     |
| 31–70   | ⚠️ Require 6-digit OTP (stored in Redis)       |
| 71–100  | 🚫 Block login + temporarily lock account      |

---

## 🧪 Demo Scenarios

### 1. Normal Login
- Login with `admin` / `password123` → **Instant Success**

### 2. New Location Trigger (MFA)
- Use a VPN or browser extension to appear from a different country.
- Login again → **MFA challenge triggered** (+30 score).
- Retrieve OTP: `docker exec fraud-cache redis-cli GET otp:admin`

### 3. Brute Force (IP Block)
```bash
# Run 6 failed logins within 1 minute
for i in {1..6}; do
  curl -s -X POST http://localhost:8080/api/auth/login \
    -H 'Content-Type: application/json' \
    -d '{"username":"admin","password":"wrong"}' | jq .status
done
```

### 4. Impossible Travel
- Login from your normal location.
- Connect to a VPN that puts you in a far continent (e.g., Asia → USA).
- Login again within a few minutes → **Blocked** (speed exceeds 800 km/h).

---

## 📡 Key API Endpoints

| Method | Endpoint                        | Description               |
|--------|---------------------------------|---------------------------|
| POST   | `/api/auth/login`               | Login with risk evaluation |
| POST   | `/api/auth/verify-otp`          | Verify MFA OTP            |
| GET    | `/api/admin/stats`              | Dashboard statistics      |
| GET    | `/api/admin/incidents`          | Recent login attempts     |
| GET    | `/api/admin/map-data`           | Geo data for threat map   |

---

## 📧 Email Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

> Use an **App Password** for Gmail (not your regular password).

---

## 🤝 Contributors

- Adeeb (Team Lead)
- Ishu
- Achintya
- Kirti

---

## 📜 License

This project is for hackathon/demo purposes.
