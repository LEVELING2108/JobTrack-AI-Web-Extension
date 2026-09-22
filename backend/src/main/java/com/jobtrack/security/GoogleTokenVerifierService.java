package com.jobtrack.security;

public interface GoogleTokenVerifierService {
    /**
     * Verifies the authenticity, audience, issuer, and signature of a Google ID Token.
     *
     * @param idTokenString The raw Google ID token string from client.
     * @return Validated GoogleTokenPayload if verification succeeds.
     * @throws com.jobtrack.exception.UnauthorizedException if token is invalid, expired, or unverified.
     */
    GoogleTokenPayload verify(String idTokenString);
}
