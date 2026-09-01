# Security Architecture & Rules — JobTrack

## 1. Golden Rules of Security
1. **Never Trust Client Identifiers**: The client must never supply `userId` in request payloads. The authenticated user must be extracted from the server-side SecurityContext (JWT).
2. **Zero Secrets in Frontend / Extension**: `JWT_SECRET`, database credentials, and third-party API keys belong exclusively on the backend server.
3. **Strict Resource Authorization**: Whenever a user requests an application, interview, or reminder (`GET /api/v1/applications/{id}`), the service verifies that `resource.userId == currentUser.id`. Unauthorized requests return `403 Forbidden` or `404 Not Found`.
4. **Password Security**: Passwords are never stored in plain text. Always hash with BCrypt (strength 12).
5. **CORS Restrictions**: Strict origin whitelisting in production for web dashboard domain and Chrome extension origin.

## 2. Token Lifetime & Lifecycle
- **Access Token**: Short-lived JWT (15 minutes).
- **Refresh Token**: Long-lived secure token (7 days) stored securely in HTTP-only cookies or encrypted storage.

## 3. Input Sanitization & Bean Validation
- Backend validation on all request DTOs using Jakarta Bean Validation (`@NotBlank`, `@Email`, `@Size`, `@Pattern`, `@NotNull`).
