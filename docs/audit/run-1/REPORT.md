# Formal Security Audit Report — JobTrack Codebase

**Run ID**: `run-1`  
**Target Repository**: `LEVELING2108/JobTrack-AI-Web-Extension`  
**Reviewed Commit**: `18495fc` (branch: `feature/formal-security-audit`)  
**Audit Profile**: `standard`  
**Execution Policy**: Sandboxed source-and-local-only (no external network, local offline verification)  
**Methodology**: [Cloudflare Security Audit Skill](https://github.com/cloudflare/security-audit-skill)  

---

## 1. Run Scope & Execution Summary
- **Scope Paths**: `backend/`, `web/`, `extension/`
- **Reviewed Boundaries**:
  1. Google OAuth Token Ingestion & Verification (`AuthServiceImpl.java`)
  2. Spring Security CORS Policy & Wildcard Origin Matching (`SecurityConfig.java`)
  3. Stateless JWT Expiration & Revocation Lifecycle (`application.yml`, `JwtTokenProvider.java`)
  4. Generative AI Prompt Assembly & Delimiting (`GeminiAiServiceImpl.java`)
  5. Content Script DOM Text Extraction (`genericExtractor.ts`)
  6. Cryptographic Key Configuration (`application.yml`)
  7. Tenant Data Isolation & Application Authorization (`ApplicationServiceImpl.java`)
- **Ledger Invariants**: Validated via `validate-coverage-ledger.cjs` (7 units valid).
- **Findings Schema**: Validated via `validate-findings.cjs` against `report-schema.json` (6 findings valid).

---

## 2. Overall Security Posture Summary
The JobTrack codebase demonstrates strong architectural isolation in its core data-access layer:
- Multi-tenant data segregation is strictly enforced in Spring Data JPA repository methods (`findByIdAndUserId`).
- BCrypt work factor 12 is consistently applied to password credentials.
- React frontend components avoid raw `dangerouslySetInnerHTML`.

However, the authentication boundary contains one **CRITICAL** vulnerability (unverified Google OAuth ID token decoding and direct email fallback leading to account takeover) and two **MEDIUM** weaknesses (overly permissive CORS origin pattern with credentials enabled, and excessive 7-day access token lifespan without revocation).

---

## 3. Confirmed Findings Summary Table

| Fingerprint | Severity | Title | Affected Boundary | Observed Result |
| :--- | :--- | :--- | :--- | :--- |
| `sec-01-unverified-google-oauth-token` | **CRITICAL** | Unverified Google OAuth ID Token & Direct Email Fallback (Account Takeover) | `AuthServiceImpl.java#loginWithGoogle` | Unauthenticated caller obtains valid JWTs for arbitrary accounts by providing target email. |
| `sec-02-wildcard-origin-cors` | **MEDIUM** | Wildcard Origin Pattern with Allowed Credentials in CORS Configuration | `SecurityConfig.java#corsConfigurationSource` | Backend dynamically reflects Origin header and sets Access-Control-Allow-Credentials: true. |
| `sec-03-excessive-token-expiration` | **MEDIUM** | Excessive 7-Day Access Token Expiration Without Revocation Mechanism | `application.yml`, `JwtTokenProvider.java` | Stateless access tokens remain valid for 168 hours with no blacklist or revocation support. |
| `sec-04-gemini-prompt-injection` | **LOW** | Direct User Input Concatenation into Gemini Prompts (Prompt Injection) | `GeminiAiServiceImpl.java` | Untrusted job descriptions concatenated directly into prompt string without XML/JSON delimiters. |
| `sec-05-extractor-innerhtml-assignment` | **LOW** | Insecure innerHTML Assignment in Generic Extractor | `genericExtractor.ts#stripHtml` | Raw third-party page HTML assigned to temporary DIV innerHTML to strip tags. |
| `sec-06-hardcoded-default-jwt-secret` | **LOW** | Hardcoded Default JWT Secret in Configuration | `application.yml#app.jwt.secret` | Fallback HMAC key allows token forgery if production environment variable is omitted. |

---

## 4. Confirmed Findings Details & Remediation

### [sec-01-unverified-google-oauth-token] CRITICAL
- **File**: `backend/src/main/java/com/jobtrack/service/impl/AuthServiceImpl.java:111-150`
- **Principal**: Unauthenticated remote actor
- **Conditions**: Attacker knows victim user's email address and sends POST request to `/api/v1/auth/google`.
- **Result**: Server generates and returns valid access and refresh tokens without verifying cryptographic signature from Google.
- **Smallest Source Fix**: Enforce Google token signature verification using `GoogleIdTokenVerifier` or Google's public JWKS endpoint; eliminate `request.getEmail()` fallback.

### [sec-02-wildcard-origin-cors] MEDIUM
- **File**: `backend/src/main/java/com/jobtrack/security/SecurityConfig.java:55-71`
- **Principal**: Untrusted third-party web origin
- **Conditions**: Victim user visits malicious website in browser while active session exists.
- **Result**: Cross-origin requests from arbitrary domains receive `Access-Control-Allow-Origin` with `Access-Control-Allow-Credentials: true`.
- **Smallest Source Fix**: Replace `configuration.addAllowedOriginPattern("*")` with explicit domain list parsed from `app.cors.allowed-origins`.

### [sec-03-excessive-token-expiration] MEDIUM
- **File**: `backend/src/main/resources/application.yml:28`
- **Principal**: Attacker in possession of intercepted access token
- **Conditions**: Token captured from network logging or client local storage.
- **Result**: Token remains valid for 7 days (168 hours) with no ability to invalidate prior to expiration.
- **Smallest Source Fix**: Reduce `access-expiration-ms` to 15 minutes (`900000` ms); retain 7 days strictly for refresh tokens.

### [sec-04-gemini-prompt-injection] LOW
- **File**: `backend/src/main/java/com/jobtrack/service/impl/GeminiAiServiceImpl.java:118`
- **Principal**: Malicious job posting author or candidate
- **Result**: Prompt override instructions processed by Gemini LLM.
- **Smallest Source Fix**: Wrap user input in XML tags (e.g. `<job_description>`) with instructions to treat contents strictly as untrusted data.

### [sec-05-extractor-innerhtml-assignment] LOW
- **File**: `extension/src/content/extractors/genericExtractor.ts:168-172`
- **Principal**: Hostile third-party web page
- **Result**: Third-party HTML parsed through DOM parser via `tmp.innerHTML`.
- **Smallest Source Fix**: Use `new DOMParser().parseFromString(html, 'text/html').body.textContent` or regex text extraction.

### [sec-06-hardcoded-default-jwt-secret] LOW
- **File**: `backend/src/main/resources/application.yml:27`
- **Principal**: Remote attacker knowing default repository configuration
- **Result**: Predictable HMAC signing key allows offline token forgery if `JWT_SECRET` env var is missing.
- **Smallest Source Fix**: Remove hardcoded fallback in production profile or enforce startup validation that terminates if default key is used.

---

## 5. Hardening Notes & Positive Security Patterns
1. **Tenant Data Isolation**: Verified that `ApplicationServiceImpl`, `InterviewServiceImpl`, and `ReminderServiceImpl` consistently enforce user scoping using `findByIdAndUserId(id, user.getId())`.
2. **Password Cryptography**: BCrypt work factor 12 is properly configured and used across all local credential handling.
3. **Frontend XSS Defense**: React components in `web/` use standard JSX text interpolation without dangerous HTML rendering.
4. **Extension Permission Minimization**: Manifest V3 configuration in `extension/public/manifest.json` requests only necessary browser permissions (`storage`, `activeTab`, `tabs`).

---

## 6. Coverage Ledger Accounting
- **Covered Units**: 1 (Tenant Data Isolation)
- **Candidate Units**: 6 (Confirmed vulnerabilities SEC-01 through SEC-06)
- **Blocked Units**: 0
- **Deferred Units**: 0
- **Out of Scope Units**: 0
- **Validation Results**: Both `validate-coverage-ledger.cjs` and `validate-findings.cjs` passed with 0 errors.
