package com.jobtrack.service;

import com.jobtrack.dto.request.LoginRequest;
import com.jobtrack.dto.request.RegisterRequest;
import com.jobtrack.dto.response.AuthResponse;
import com.jobtrack.dto.response.UserProfileResponse;
import com.jobtrack.entity.User;
import com.jobtrack.exception.DuplicateResourceException;
import com.jobtrack.mapper.UserMapper;
import com.jobtrack.repository.UserRepository;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

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

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User sampleUser;
    private UserPrincipal principal;

    @BeforeEach
    void setUp() {
        registerRequest = RegisterRequest.builder()
                .name("Alex Smith")
                .email("alex@example.com")
                .password("secret123")
                .build();

        loginRequest = LoginRequest.builder()
                .email("alex@example.com")
                .password("secret123")
                .build();

        sampleUser = User.builder()
                .id(1L)
                .name("Alex Smith")
                .email("alex@example.com")
                .passwordHash("hashedSecret")
                .build();

        principal = UserPrincipal.create(sampleUser);
    }

    @Test
    @DisplayName("Should register new user and return JWT tokens")
    void testRegister_Success() {
        when(userRepository.existsByEmail("alex@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("hashedSecret");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(tokenProvider.generateAccessToken(any(UserPrincipal.class))).thenReturn("mock-access-token");
        when(tokenProvider.generateRefreshToken(any(UserPrincipal.class))).thenReturn("mock-refresh-token");
        when(tokenProvider.getAccessExpirationMs()).thenReturn(900000L);
        when(userMapper.toProfileResponse(sampleUser)).thenReturn(
                UserProfileResponse.builder().id(1L).name("Alex Smith").email("alex@example.com").build()
        );

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("mock-access-token", response.getAccessToken());
        assertEquals("mock-refresh-token", response.getRefreshToken());
        assertEquals("alex@example.com", response.getUser().getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when email is already registered")
    void testRegister_DuplicateEmailThrowsException() {
        when(userRepository.existsByEmail("alex@example.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should authenticate and return tokens on valid login")
    void testLogin_Success() {
        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(principal);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);

        when(tokenProvider.generateAccessToken(principal)).thenReturn("mock-access-token");
        when(tokenProvider.generateRefreshToken(principal)).thenReturn("mock-refresh-token");
        when(tokenProvider.getAccessExpirationMs()).thenReturn(900000L);
        when(userMapper.toProfileResponse(sampleUser)).thenReturn(
                UserProfileResponse.builder().id(1L).name("Alex Smith").email("alex@example.com").build()
        );

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertEquals("mock-access-token", response.getAccessToken());
        assertEquals("alex@example.com", response.getUser().getEmail());
    }
}
