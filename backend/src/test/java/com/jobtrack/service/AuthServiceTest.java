package com.jobtrack.service;

import com.jobtrack.dto.request.GoogleAuthRequest;
import com.jobtrack.dto.request.LoginRequest;
import com.jobtrack.dto.request.RegisterRequest;
import com.jobtrack.dto.response.AuthResponse;
import com.jobtrack.dto.response.UserProfileResponse;
import com.jobtrack.entity.User;
import com.jobtrack.enums.OAuthProvider;
import com.jobtrack.mapper.UserMapper;
import com.jobtrack.repository.UserRepository;
import com.jobtrack.exception.BadRequestException;
import com.jobtrack.exception.UnauthorizedException;
import com.jobtrack.security.GoogleTokenPayload;
import com.jobtrack.security.GoogleTokenVerifierService;
import com.jobtrack.security.JwtTokenProvider;
import com.jobtrack.security.UserPrincipal;
import com.jobtrack.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private UserMapper userMapper;

    @Mock
    private GoogleTokenVerifierService googleTokenVerifierService;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;
    private UserProfileResponse sampleProfile;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .name("Alex Smith")
                .email("alex@example.com")
                .passwordHash("hashed_pw")
                .oauthProvider(OAuthProvider.LOCAL)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        sampleProfile = UserProfileResponse.builder()
                .id(1L)
                .name("Alex Smith")
                .email("alex@example.com")
                .createdAt(sampleUser.getCreatedAt())
                .build();
    }

    @Test
    @DisplayName("Should register new user and return JWT tokens")
    void testRegister() {
        RegisterRequest request = RegisterRequest.builder()
                .name("Alex Smith")
                .email("alex@example.com")
                .password("Password123!")
                .build();

        when(userRepository.existsByEmail("alex@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123!")).thenReturn("hashed_pw");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(tokenProvider.generateAccessToken(any(UserPrincipal.class))).thenReturn("access_token");
        when(tokenProvider.generateRefreshToken(any(UserPrincipal.class))).thenReturn("refresh_token");
        when(tokenProvider.getAccessExpirationMs()).thenReturn(900000L);
        when(userMapper.toProfileResponse(sampleUser)).thenReturn(sampleProfile);

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("access_token", response.getAccessToken());
        assertEquals("refresh_token", response.getRefreshToken());
        assertEquals("alex@example.com", response.getUser().getEmail());
    }

    @Test
    @DisplayName("Should authenticate user and return tokens")
    void testLogin() {
        LoginRequest request = LoginRequest.builder()
                .email("alex@example.com")
                .password("Password123!")
                .build();

        UserPrincipal principal = UserPrincipal.create(sampleUser);
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authToken);
        when(tokenProvider.generateAccessToken(any(UserPrincipal.class))).thenReturn("access_token");
        when(tokenProvider.generateRefreshToken(any(UserPrincipal.class))).thenReturn("refresh_token");
        when(tokenProvider.getAccessExpirationMs()).thenReturn(900000L);
        when(userMapper.toProfileResponse(sampleUser)).thenReturn(sampleProfile);

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("access_token", response.getAccessToken());
    }

    @Test
    @DisplayName("Should authenticate via Google OAuth and auto-create user when token is verified")
    void testGoogleLogin_AutoRegister() {
        GoogleAuthRequest request = GoogleAuthRequest.builder()
                .idToken("mock_google_id_token")
                .build();

        when(googleTokenVerifierService.verify("mock_google_id_token")).thenReturn(
                GoogleTokenPayload.builder()
                        .email("google.user@example.com")
                        .name("Google User")
                        .sub("google_sub_123")
                        .emailVerified(true)
                        .build()
        );

        User googleUser = User.builder()
                .id(2L)
                .name("Google User")
                .email("google.user@example.com")
                .oauthProvider(OAuthProvider.GOOGLE)
                .oauthId("google_sub_123")
                .build();

        UserProfileResponse googleProfile = UserProfileResponse.builder()
                .id(2L)
                .name("Google User")
                .email("google.user@example.com")
                .build();

        when(userRepository.findByEmail("google.user@example.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(googleUser);
        when(tokenProvider.generateAccessToken(any(UserPrincipal.class))).thenReturn("google_access_token");
        when(tokenProvider.generateRefreshToken(any(UserPrincipal.class))).thenReturn("google_refresh_token");
        when(tokenProvider.getAccessExpirationMs()).thenReturn(900000L);
        when(userMapper.toProfileResponse(googleUser)).thenReturn(googleProfile);

        AuthResponse response = authService.loginWithGoogle(request);

        assertNotNull(response);
        assertEquals("google_access_token", response.getAccessToken());
        assertEquals("google.user@example.com", response.getUser().getEmail());
    }

    @Test
    @DisplayName("Should reject Google login when ID token signature verification fails (SEC-01)")
    void testGoogleLogin_InvalidToken_ThrowsUnauthorized() {
        GoogleAuthRequest request = GoogleAuthRequest.builder()
                .idToken("forged_or_invalid_id_token")
                .email("victim@example.com")
                .build();

        when(googleTokenVerifierService.verify("forged_or_invalid_id_token"))
                .thenThrow(new UnauthorizedException("Invalid Google token issuer."));

        assertThrows(UnauthorizedException.class, () -> authService.loginWithGoogle(request));
    }

    @Test
    @DisplayName("Should reject Google login when email is not verified by Google (SEC-01)")
    void testGoogleLogin_UnverifiedEmail_ThrowsUnauthorized() {
        GoogleAuthRequest request = GoogleAuthRequest.builder()
                .idToken("valid_token_unverified_email")
                .build();

        when(googleTokenVerifierService.verify("valid_token_unverified_email")).thenReturn(
                GoogleTokenPayload.builder()
                        .email("unverified@example.com")
                        .emailVerified(false)
                        .build()
        );

        assertThrows(UnauthorizedException.class, () -> authService.loginWithGoogle(request));
    }

    @Test
    @DisplayName("Should reject Google login when ID token is missing (SEC-01)")
    void testGoogleLogin_MissingToken_ThrowsBadRequest() {
        GoogleAuthRequest request = GoogleAuthRequest.builder()
                .email("attacker@example.com")
                .build();

        assertThrows(BadRequestException.class, () -> authService.loginWithGoogle(request));
    }
}
