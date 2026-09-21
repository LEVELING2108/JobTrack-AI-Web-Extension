# JobTrack System Architecture & Security Model

## 1. Product, Principals, and Normal Authority
JobTrack is an AI-powered job application tracking platform composed of:
- A Spring Boot 3.3.4 REST API backend (`backend/`) with PostgreSQL/H2 persistence.
- A React 18 / Vite single-page application dashboard (`web/`).
- A Manifest V3 Chrome Extension (`extension/`) with DOM content extractors, background service worker, and popup UI.

### Principals:
1. **Anonymous / Untrusted Web Visitor**: Can access public authentication endpoints (`/api/v1/auth/**`), OpenAPI docs, actuator health, or external third-party job boards.
2. **Authenticated User**: Holder of a valid HMAC-SHA256 JWT access token. Authorized to perform CRUD operations strictly against their own job applications, interviews, reminders, and profile data.
3. **Third-Party Job Board Context**: Untrusted HTML/DOM on external sites (LinkedIn, Indeed, etc.) scraped by extension content scripts.
4. **Third-Party AI Model**: Google Gemini API receiving structured prompts containing candidate resumes and job postings.

## 2. Technology Stack & Local Execution Boundaries
- **Backend**: Java 17, Spring Boot 3.3.4, Spring Security 6.3.3, JJWT 0.12.5, H2 / PostgreSQL 16.
- **Frontend & Extension**: Node 20+, TypeScript, Vite 5, React 18, Tailwind CSS, Chrome Extension MV3 APIs.
- **Local Test Execution**: `./mvnw test` runs isolated Spring context and repository tests against in-memory H2. Frontend runs `npm run build` and `npm run lint` offline.

## 3. Entry Surfaces
- **HTTP REST Endpoints**: `/api/v1/auth/login`, `/register`, `/google`, `/refresh`, `/api/v1/applications/**`, `/api/v1/interviews/**`, `/api/v1/reminders/**`, `/api/v1/analytics/**`, `/api/v1/ai/**`.
- **Browser Extension Messaging**: Chrome runtime message passing between content scripts and popup/background worker.
- **Cross-Window Auth Bridge**: `window.postMessage` between `web/` and extension background context.
- **External Third-Party DOM**: Job description text scraped via `genericExtractor.ts` and platform-specific extractors.

## 4. Trust Boundaries & Strongest Source Controls
1. **Public vs. Protected API Boundary**: Enforced by `SecurityConfig.java` and `JwtAuthenticationFilter.java`. Validates Bearer JWT signature against `app.jwt.secret`.
2. **Tenant Isolation Boundary**: Enforced in Spring service implementations (`ApplicationServiceImpl`, etc.) using `findByIdAndUserId(id, user.getId())`. Prevents cross-tenant data leaks.
3. **Identity Verification Boundary**: Located in `AuthServiceImpl.java#loginWithGoogle`. Intended to cryptographically verify Google OAuth identity tokens.
4. **Cross-Origin Boundary (CORS)**: Configured in `SecurityConfig.java#corsConfigurationSource`. Controls browser access from external origins.
5. **DOM Content Script Boundary**: Located in `genericExtractor.ts`. Normalizes and strips untrusted third-party HTML.
6. **LLM Generative Boundary**: Located in `GeminiAiServiceImpl.java`. Structures user inputs before dispatching to Google Gemini API.

## 5. Starting Paths for Security Analysis
- `backend/src/main/java/com/jobtrack/security/SecurityConfig.java`
- `backend/src/main/java/com/jobtrack/security/JwtAuthenticationFilter.java`
- `backend/src/main/java/com/jobtrack/security/JwtTokenProvider.java`
- `backend/src/main/java/com/jobtrack/service/impl/AuthServiceImpl.java`
- `backend/src/main/java/com/jobtrack/service/impl/ApplicationServiceImpl.java`
- `backend/src/main/java/com/jobtrack/service/impl/GeminiAiServiceImpl.java`
- `backend/src/main/resources/application.yml`
- `extension/src/content/extractors/genericExtractor.ts`
- `extension/public/manifest.json`
- `web/src/context/AuthContext.tsx`

## 6. Selected Attack Companions
- **WEB-PROTOCOL-AND-AUTH.md**: Applies to Spring Security, JWT authentication, OAuth flow, and CORS.
- **CLIENT-SIDE.md**: Applies to React SPA token storage, XSS resistance, and Chrome Extension MV3 content scripts.
- **DATA-ISOLATION-AND-LIFECYCLE.md**: Applies to multi-tenant isolation, user scoping in JPA repositories, and session expiration.
- **AI-AND-LLM.md**: Applies to prompt assembly and LLM output parsing in `GeminiAiServiceImpl.java`.
- **CLOUD-AND-DEPLOYMENT.md**: Applies to Dockerfiles, Nginx configurations, and Antideploy setup.
