# JobTrack — AI-Powered Job Application Tracker

[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.x-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Chrome Extension](https://img.shields.io/badge/Extension-Manifest%20V3-4285F4?logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Java](https://img.shields.io/badge/Java-21%20LTS-ED8B00?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**JobTrack** is an all-in-one job application tracker that combines a **Manifest V3 Chrome Extension** with a **React Web Dashboard** and a **Spring Boot REST API**. It allows job seekers to capture job postings directly from LinkedIn, Indeed, and company portals in 1 click, track applications on an interactive Kanban board, and evaluate skill compatibility with AI match scoring.

---

## 🚀 Live Demo & Links

- **Web Dashboard**: [https://jobtrack.antideploy.com](https://jobtrack.antideploy.com)
- **Extension Showcase & Install Guide**: [https://jobtrack.antideploy.com/extension](https://jobtrack.antideploy.com/extension)
- **Extension Standalone Download (.zip)**: [jobtrack-extension.zip](https://jobtrack.antideploy.com/downloads/jobtrack-extension.zip)
- **API Documentation**: [Swagger UI](https://jobtrack-api.antideploy.com/swagger-ui/index.html)
- **API Health Probe**: [Actuator Health](https://jobtrack-api.antideploy.com/actuator/health)

---

## ✨ Core Features

- **1-Click Job Capture**: Auto-extract title, company, salary, location, and description from LinkedIn, Indeed, Glassdoor, and career pages.
- **Kanban Application Pipeline**: Drag-and-drop tracking across *Saved*, *Applied*, *Interviewing*, *Offer*, and *Rejected* stages.
- **AI Skill Match Scoring**: Automatically compares required job qualifications against candidate skill profiles.
- **Interview & Reminder Tracker**: Schedule upcoming interview rounds, add preparation notes, and track dates.
- **Zero-Config Database**: Automatically connects to PostgreSQL if available, or gracefully falls back to an embedded H2 database for instant local startup.

---

## 💻 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Browser Extension** | Chrome Manifest V3, TypeScript, React 18, Tailwind CSS, Vite |
| **Web Dashboard** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, DnD Kit (Kanban) |
| **Backend REST API** | Java 21 LTS, Spring Boot 3.x, Spring Security (Stateless JWT), Spring Data JPA |
| **Database & Storage** | PostgreSQL 16 (Production/Docker), H2 Database (Zero-config local fallback) |
| **AI & Heuristics** | Google Gemini API (LLM analysis) & Integrated Rule-Based Match Scoring Engine |
| **DevOps & Cloud** | Docker, Docker Compose, Nginx, GitHub Actions (CI/CD), Antideploy Cloud |

---

## 🛠️ Local Setup & Quick Start

### Prerequisites
- **Node.js**: v20+ (recommended v22)
- **Java**: JDK 21+
- **Docker** *(Optional)*: Only needed if you prefer running PostgreSQL over the built-in H2 database.

---

### 1. Clone the Repository
```bash
git clone https://github.com/LEVELING2108/JobTrack-AI-Web-Extension.git
cd JobTrack-AI-Web-Extension
```

---

### 2. Start Backend API (Spring Boot)
The backend automatically falls back to an embedded H2 database if PostgreSQL is not running—zero database setup required.

```bash
cd backend

# Windows
.\mvnw.cmd spring-boot:run

# macOS / Linux
./mvnw spring-boot:run
```
- API Base URL: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

*(Optional: To run PostgreSQL with Docker instead, run `docker compose up -d` in the root folder before starting the backend).*

---

### 3. Start Web Dashboard (React)
In a second terminal:

```bash
cd web
npm install
npm run dev
```
- Open `http://localhost:5173` in your browser.

---

### 4. Build & Load Chrome Extension
In a third terminal:

```bash
cd extension
npm install
npm run build
```

**Load into Chrome / Edge / Brave / Opera:**
1. Open your browser and navigate to `chrome://extensions` (or `edge://extensions`).
2. Toggle **Developer mode** **ON** (top-right corner).
3. Click **Load unpacked** (top-left corner).
4. Select the `extension/dist` folder.
5. The JobTrack extension is now active and pinned to your toolbar!

---

## 🎥 Video Walkthrough (How to Install & Use)

> **Video Guide**: Watch how to download, install the extension, and track job applications in 1 click.

<!-- Add your demo video link or embed here -->
<!-- Example: [![Watch Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID) -->

*(Video walkthrough placeholder — insert your demo video link or embed here)*

---

## ⚙️ Environment Variables (Optional)

The repository works out of the box with defaults. To customize:

| Component | Location / Variable | Description |
| :--- | :--- | :--- |
| **Backend** | `backend/src/main/resources/application.yml` | Port (`8080`), database credentials, JWT secret |
| **Backend** | `GEMINI_API_KEY` | *(Optional)* Google Gemini API key for advanced generative AI |
| **Web** | `web/.env` (`VITE_API_BASE_URL`) | Target API endpoint (defaults to `http://localhost:8080/api/v1`) |
| **Extension** | `extension/.env` (`VITE_API_BASE_URL`) | Target API endpoint (defaults to `http://localhost:8080/api/v1`) |

---

## 🧪 Testing

```bash
# Run backend tests
cd backend && .\mvnw.cmd test

# Verify web build
cd web && npm run build

# Verify extension package
cd extension && npm run package
```

---

## 📄 License

Distributed under the [MIT License](LICENSE).
