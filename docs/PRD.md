# Product Requirements Document (PRD) — JobTrack

## 1. Product Overview
JobTrack is a unified browser extension and web platform that empowers job seekers to discover, collect, track, and manage job applications across the web with minimal manual effort.

## 2. Core User Objectives
- **Frictionless Capture**: Automatically extract job details from job boards (LinkedIn, Indeed, Glassdoor, company career portals) and generic career pages.
- **Application Lifecycle Tracking**: Track progression across standardized stages: `SAVED`, `APPLIED`, `SCREENING`, `INTERVIEW`, `OFFER`, `ACCEPTED`, `REJECTED`, `WITHDRAWN`.
- **Deduplication**: Prevent duplicate entries via normalized URL and company/title heuristics.
- **Interview & Reminder Management**: Record interview rounds, dates, interviewer details, and set follow-up reminders.
- **Analytics & Insights**: Measure application volume, funnel conversion rates, and response metrics.

## 3. Product Components
1. **Chrome Extension (Manifest V3)**: Fast popup UI + isolated content script extractors + background service worker.
2. **Web Dashboard (React + TypeScript + Vite)**: Full-featured desktop/mobile-friendly management dashboard.
3. **Backend REST API (Spring Boot 3.x + Java 21)**: Layered REST API handling business logic, validation, authentication, and deduplication.
4. **Database (PostgreSQL)**: Scalable relational data store with normalized job definitions.

## 4. Phased Roadmap
- **Phase 1**: Project Scaffolding & Setup (Infrastructure, Docs, Docker, Maven, Vite).
- **Phase 2**: Chrome Extension MVP (Manifest V3, Popup, Content Script Extractors).
- **Phase 3**: Spring Boot Core Backend & PostgreSQL persistence.
- **Phase 4**: Security & JWT Authentication with refresh tokens.
- **Phase 5**: Extension-to-API Integration.
- **Phase 6**: Web Dashboard with Kanban board & application tables.
- **Phase 7**: Interviews & Reminders Module.
- **Phase 8**: Analytics & Metrics Dashboard.
- **Phase 9**: AI Job Description Skill Extraction & Resume Matching (Optional).
