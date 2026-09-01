# JobTrack — AI-Powered Job Application Tracker

[![Manifest V3](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-4285F4?logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.x-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

JobTrack is a full-stack platform designed to help job seekers collect, organize, monitor, and analyze job applications directly from job boards and company career pages with minimal manual entry.

---

## 🏛️ System Architecture

`
                          JOBTRACK SYSTEM
                                 │
              ┌──────────────────┴──────────────────┐
              ▼                                     ▼
       CHROME EXTENSION                       WEB DASHBOARD
     (React + TS + Vite)                   (React + TS + Vite)
     (Manifest V3 Popup &                   (Kanban, Analytics,
       Content Scripts)                      Application List)
              │                                     │
              └──────────────────┬──────────────────┘
                                 │ HTTPS (REST API)
                                 ▼
                        SPRING BOOT BACKEND
                     (Java 21/22 + Spring Boot 3)
                     (Auth, Security, Validation,
                      Deduplication, Analytics)
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
               POSTGRESQL                AI SERVICES
            (Docker / Cloud)          (Resume matching &
                                      skill analysis)
`

---

## 📂 Repository Structure

`
jobtrack/
├── extension/          # Chrome Extension (React + TS + Manifest V3)
├── web/                # Web Dashboard (React + TS + Vite + Tailwind CSS)
├── backend/            # REST API (Spring Boot 3.x + Spring Security + JPA)
├── database/           # DB schema, migrations, seed data
├── docs/               # PRD, Architecture, API, Database, and Security specs
├── docker-compose.yml  # Local PostgreSQL container configuration
├── .env.example        # Environment variable templates
└── README.md           # Project documentation
`

---

## 🚀 Quick Start (Development)

### Prerequisites
- **Node.js**: v20+ (v24 recommended)
- **Java**: JDK 21+
- **Docker**: Docker Desktop (for PostgreSQL)

### 1. Database
`ash
docker compose up -d
`

### 2. Backend (Spring Boot)
`ash
cd backend
./mvnw spring-boot:run
`

### 3. Web Dashboard (React)
`ash
cd web
npm install
npm run dev
`

### 4. Chrome Extension
`ash
cd extension
npm install
npm run build
`
Load the xtension/dist folder into chrome://extensions (Enable **Developer Mode** -> **Load unpacked**).

---

## 🔒 Security & Golden Rules
1. **Zero Client Trust**: All user ownership, deduplication, and authorization checks are enforced on the backend.
2. **Safe Secrets**: No API keys, JWT secrets, or DB credentials exist in the extension or web client.
3. **Clean Extraction**: Content extractors are isolated adapters; site DOM changes will never break backend or dashboard logic.
