# Compounding Life (Health + Wealth)

> *"To finish first, you must first finish."* — Rick Mears (quoted frequently by Charlie Munger & Warren Buffett)  
> The ultimate compounding machine is a human being who has their **physical health** and **financial freedom** protected over decades. No get-rich-quick schemes, no trading, no biohacking fads—just boring, simple things that compound over time.

---

## 🏛️ Core Philosophy

Human well-being rests on two fundamental pillars:
1. **Physical Longevity (Health)**: 7–8 hours sleep, 8,000–10,000 daily steps, real home-cooked food, zero smoking, low stress.
2. **Financial Longevity (Wealth)**: Automated monthly SIP with step-up, 6–12 months emergency fund, pure term insurance, family health floater + super top-up.
3. **The Inversion Principle (Charlie Munger)**: Avoid ruin first. Avoid debt, avoid trading/F&O, avoid sleep deprivation, and avoid panic-selling during market volatility.

---

## 🚀 Tech Stack

- **Backend**: Java 21 LTS, Spring Boot 3.3, Spring Web, Spring AI, Jackson, JUnit 5
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons
- **AI & MCP**: Google Gemini Flash Pro API integration + Model Context Protocol (MCP) server
- **DevOps**: Multi-stage Docker, Docker Compose, Nginx, GitHub Actions CI/CD
- **Cloud**: Google Cloud Run (Serverless, zero-idle cost)

---

## 📂 Project Structure

```
compounding-life/
├── backend/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/compoundinglife/
│       │   ├── CompoundingLifeApplication.java
│       │   ├── config/ (CorsConfig, GeminiConfig)
│       │   ├── controller/ (Finance, Wisdom, Habits, AI, MCP)
│       │   ├── model/ (SIP, Protection, Wisdom, Habits, MCP)
│       │   └── service/ (FinanceCalculationService, WisdomService, HabitService, GeminiAiService, McpService)
│       └── test/ (Unit and validation tests)
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── src/
│       ├── components/ (Navbar, SipCalculator, EmergencyFund, InsuranceAdvisor, DailyHabits, WisdomHub, AiAssistant)
│       └── App.tsx
├── docker/
│   ├── Dockerfile.backend (Eclipse Temurin JRE 21 multi-stage)
│   ├── Dockerfile.frontend (Nginx Alpine multi-stage)
│   └── nginx.conf (Reverse proxy /api/ to backend)
├── docker-compose.yml
└── .github/workflows/deploy-gcp.yml (Automated GCP Cloud Run deployment)
```

---

## ⚡ Quick Start (Local Run)

### Option 1: Run with Docker Compose (Recommended)
Make sure Docker Desktop is running, then run:
```bash
docker compose up --build
```
- Open **http://localhost:3000** in your browser.
- The React frontend is served by Nginx and proxies `/api/*` requests to the Spring Boot backend on port 8080.

---

### Option 2: Run Locally Without Docker

#### Backend (Spring Boot 3 + Java 21):
```bash
cd backend
mvn clean spring-boot:run
```
Backend runs on `http://localhost:8080`.

#### Frontend (React + Vite):
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173` (configured to proxy `/api` to port 8080).

---

## 🤖 Model Context Protocol (MCP) Endpoints

The backend implements MCP tool endpoints for AI agents:
- `GET /api/mcp/tools` — Lists all callable financial & wisdom tools in JSON Schema format.
- `POST /api/mcp/call` — Executes tool invocations:
  - `calculate_sip`
  - `calculate_emergency_fund`
  - `calculate_insurance_needs`
  - `get_wisdom_quote`

---

## ☁️ Google Cloud Platform (GCP) Deployment

1. Create a project in Google Cloud Console (e.g. `compounding-life-prod`).
2. Enable Cloud Run and Artifact Registry APIs:
   ```bash
   gcloud services enable run.googleapis.com artifactregistry.googleapis.com
   ```
3. Add the following repository secrets to your GitHub repository:
   - `GCP_PROJECT_ID`: Your GCP project ID
   - `GCP_SA_KEY`: Service account JSON key with Cloud Run Admin & Artifact Registry Writer roles
   - `GEMINI_API_KEY`: Your Google Gemini API Key
4. Push to `main` branch. GitHub Actions will build both Docker images, push to Artifact Registry, and deploy both services to Google Cloud Run!
