# Detailed Findings Analysis & Proof of Trace

This document provides exhaustive traces, evidence citations, and native interface reproduction steps for all confirmed `critical` and `medium` vulnerabilities identified during the security audit.

---

## Finding: sec-01-unverified-google-oauth-token
- **Title**: Unverified Google OAuth ID Token & Direct Email Fallback (Account Takeover)
- **Severity**: **CRITICAL** (Likelihood: HIGH, Impact: CRITICAL)
- **Affected File**: `backend/src/main/java/com/jobtrack/service/impl/AuthServiceImpl.java:111-150`

### Ordered Trace:
1. **[Entrypoint]** `backend/src/main/java/com/jobtrack/controller/AuthController.java:42` (`AuthController.loginWithGoogle`)
   - Receives unauthenticated POST request to `/api/v1/auth/google` with `GoogleAuthRequest` body containing client-supplied `idToken`, `email`, and `name`.
2. **[Propagation]** `backend/src/main/java/com/jobtrack/service/impl/AuthServiceImpl.java:111-136` (`AuthServiceImpl.loginWithGoogle`)
   - Splits `request.getIdToken()` on `.` and decodes the second part using standard Base64 URL decoder:
     ```java
     byte[] decoded = Base64.getUrlDecoder().decode(parts[1]);
     JsonNode payload = objectMapper.readTree(new String(decoded, StandardCharsets.UTF_8));
     if (payload.has("email")) { email = payload.get("email").asText(); }
     ```
   - Signature is never checked. If `email` is still null, falls back to:
     ```java
     if (email == null && request.getEmail() != null) { email = request.getEmail(); }
     ```
3. **[Sink]** `backend/src/main/java/com/jobtrack/service/impl/AuthServiceImpl.java:150-184`
   - Looks up existing user by unverified email: `userRepository.findByEmail(normalizedEmail)`.
   - Mints valid JWT access token (`tokenProvider.generateAccessToken(principal)`) and refresh token.
   - Returns `AuthResponse` containing tokens to the caller.

### Bounded Local Reproduction:
```http
POST /api/v1/auth/google HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "email": "victim@example.com",
  "name": "Victim User"
}
```
**Observed Result**: Server returns HTTP 200 with active JWT access token for `victim@example.com` without communicating with Google or verifying credentials.

### Remediation:
Add `google-api-client` library and verify token using `GoogleIdTokenVerifier`:
```java
GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
    .setAudience(Collections.singletonList(googleClientId))
    .build();
GoogleIdToken idToken = verifier.verify(request.getIdToken());
if (idToken == null) {
    throw new UnauthorizedException("Invalid Google ID token");
}
email = idToken.getPayload().getEmail();
```
Remove the client request email fallback entirely.

---

## Finding: sec-02-wildcard-origin-cors
- **Title**: Wildcard Origin Pattern with Allowed Credentials in CORS Configuration
- **Severity**: **MEDIUM** (Likelihood: MEDIUM, Impact: MEDIUM)
- **Affected File**: `backend/src/main/java/com/jobtrack/security/SecurityConfig.java:55-71`

### Ordered Trace:
1. **[Entrypoint]** `backend/src/main/java/com/jobtrack/security/SecurityConfig.java:55` (`SecurityConfig.corsConfigurationSource`)
   - Instantiates `CorsConfiguration`.
2. **[Propagation]** `backend/src/main/java/com/jobtrack/security/SecurityConfig.java:57-60`
   - Executes:
     ```java
     configuration.addAllowedOriginPattern("*");
     configuration.setAllowCredentials(true);
     ```
3. **[Sink]** `backend/src/main/java/com/jobtrack/security/SecurityConfig.java:71`
   - Registers configuration for all routes `/**` in Spring Security filter chain.

### Bounded Local Reproduction:
```http
OPTIONS /api/v1/applications HTTP/1.1
Host: localhost:8080
Origin: https://malicious-site.com
Access-Control-Request-Method: GET
```
**Observed Result**: Response includes:
```http
Access-Control-Allow-Origin: https://malicious-site.com
Access-Control-Allow-Credentials: true
```

### Remediation:
Parse `allowedOrigins` property and configure explicit origin matching:
```java
List<String> origins = Arrays.stream(allowedOrigins.split(","))
    .map(String::trim)
    .filter(s -> !s.isEmpty())
    .collect(Collectors.toList());
configuration.setAllowedOrigins(origins);
```

---

## Finding: sec-03-excessive-token-expiration
- **Title**: Excessive 7-Day Access Token Expiration Without Revocation Mechanism
- **Severity**: **MEDIUM** (Likelihood: LOW, Impact: MEDIUM)
- **Affected File**: `backend/src/main/resources/application.yml:28`

### Ordered Trace:
1. **[Entrypoint]** `backend/src/main/resources/application.yml:28`
   - `access-expiration-ms: ${JWT_ACCESS_EXPIRATION:604800000}`
2. **[Propagation]** `backend/src/main/java/com/jobtrack/security/JwtTokenProvider.java:42`
   - Generates JWT claims with `expiration = new Date(now.getTime() + accessExpirationMs)`.
3. **[Sink]** `backend/src/main/java/com/jobtrack/security/JwtAuthenticationFilter.java:35`
   - Validates cryptographic signature statelessly; permits access for 7 full days with no revocation registry.

### Remediation:
Configure access token expiration to 15 minutes (`900000` ms) in `application.yml`.
