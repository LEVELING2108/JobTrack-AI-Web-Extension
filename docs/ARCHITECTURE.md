# System Architecture — JobTrack

## Architecture Overview

```
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
```

## Module Boundaries & Layers

### 1. Browser Extension (`/extension`)
- **Manifest V3**: Complies with latest Chrome extension specifications.
- **Content Scripts (`src/content/extractors`)**: Implements `JobExtractor` interface (`canHandle(url)` / `extract()`) for modular site adapters.
- **Background Service Worker (`src/background`)**: Message passing, auth token synchronization, notification handling.
- **Popup (`src/popup`)**: Compact React interface for instant capture and status selection.

### 2. Web Dashboard (`/web`)
- Single Page Application built with React, TypeScript, and Vite.
- Styled with Tailwind CSS, utilizing React Router for navigation and TanStack Query for server state management.

### 3. Backend REST API (`/backend`)
- **Controller Layer (`com.jobtrack.controller`)**: Exposes REST endpoints under `/api/v1/`.
- **Service Layer (`com.jobtrack.service`)**: Encapsulates business logic, deduplication, and authorization rules.
- **Repository Layer (`com.jobtrack.repository`)**: Spring Data JPA repositories communicating with PostgreSQL.
- **Security (`com.jobtrack.security`)**: JWT filter, UserDetailsService, and password encryption (BCrypt).
- **Global Exception Handling (`com.jobtrack.exception`)**: Standardized JSON error envelopes with HTTP status mapping.

### 4. Database (`/database`)
- Normalized shared `jobs` table to prevent duplication across different users tracking the same opening.
- User-specific data isolated in `applications`, `interviews`, `reminders`, `user_skills`, and `resumes`.
