package com.jobtrack.security;

import com.jobtrack.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;
    private UserPrincipal principal;

    @BeforeEach
    void setUp() {
        // Base64 256-bit test secret
        String secret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
        tokenProvider = new JwtTokenProvider(secret, 900000, 604800000);

        User user = User.builder().id(42L).name("Jane Doe").email("jane@example.com").build();
        principal = UserPrincipal.create(user);
    }

    @Test
    @DisplayName("Should generate valid JWT access token and extract user id")
    void testGenerateAndValidateAccessToken() {
        String token = tokenProvider.generateAccessToken(principal);
        assertNotNull(token);
        assertTrue(tokenProvider.validateToken(token));
        assertEquals(42L, tokenProvider.getUserIdFromToken(token));
    }

    @Test
    @DisplayName("Should generate valid JWT refresh token")
    void testGenerateRefreshToken() {
        String token = tokenProvider.generateRefreshToken(principal);
        assertNotNull(token);
        assertTrue(tokenProvider.validateToken(token));
        assertEquals(42L, tokenProvider.getUserIdFromToken(token));
    }

    @Test
    @DisplayName("Should return false for invalid or tampered token")
    void testInvalidToken() {
        assertFalse(tokenProvider.validateToken("invalid.jwt.token"));
    }
}
