package com.jobtrack.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobtrack.dto.request.GoogleAuthRequest;
import com.jobtrack.dto.request.LoginRequest;
import com.jobtrack.dto.request.RefreshTokenRequest;
import com.jobtrack.dto.request.RegisterRequest;
import com.jobtrack.dto.response.AuthResponse;
import com.jobtrack.dto.response.UserProfileResponse;
import com.jobtrack.entity.User;
import com.jobtrack.enums.OAuthProvider;
import com.jobtrack.exception.BadRequestException;
import com.jobtrack.exception.DuplicateResourceException;
import com.jobtrack.exception.ResourceNotFoundException;
import com.jobtrack.mapper.UserMapper;
import com.jobtrack.repository.UserRepository;
import com.jobtrack.security.JwtTokenProvider;
import com.jobtrack.security.UserPrincipal;
import com.jobtrack.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserMapper userMapper;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateResourceException("An account with email " + normalizedEmail + " already exists.");
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .oauthProvider(OAuthProvider.LOCAL)
                .build();

        User savedUser = userRepository.save(user);
        log.info("Registered new user [id={}, email={}]", savedUser.getId(), savedUser.getEmail());

        UserPrincipal principal = UserPrincipal.create(savedUser);
        String accessToken = tokenProvider.generateAccessToken(principal);
        String refreshToken = tokenProvider.generateRefreshToken(principal);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(tokenProvider.getAccessExpirationMs() / 1000)
                .user(userMapper.toProfileResponse(savedUser))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        String accessToken = tokenProvider.generateAccessToken(principal);
        String refreshToken = tokenProvider.generateRefreshToken(principal);

        log.info("User logged in successfully [id={}, email={}]", principal.getId(), principal.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(tokenProvider.getAccessExpirationMs() / 1000)
                .user(userMapper.toProfileResponse(principal.getUser()))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse loginWithGoogle(GoogleAuthRequest request) {
        String email = null;
        String name = null;
        String sub = null;

        // Try decoding JWT payload from Google ID Token
        if (request.getIdToken() != null && request.getIdToken().contains(".")) {
            try {
                String[] parts = request.getIdToken().split("\\.");
                if (parts.length >= 2) {
                    byte[] decoded = Base64.getUrlDecoder().decode(parts[1]);
                    JsonNode payload = objectMapper.readTree(new String(decoded, StandardCharsets.UTF_8));

                    if (payload.has("email")) {
                        email = payload.get("email").asText();
                    }
                    if (payload.has("name")) {
                        name = payload.get("name").asText();
                    }
                    if (payload.has("sub")) {
                        sub = payload.get("sub").asText();
                    }
                }
            } catch (Exception e) {
                log.warn("Failed to parse Google ID Token payload directly: {}", e.getMessage());
            }
        }

        // Fallback to explicit request fields if client passed them
        if (email == null && request.getEmail() != null) {
            email = request.getEmail();
        }
        if (name == null && request.getName() != null) {
            name = request.getName();
        }

        if (email == null || email.isBlank()) {
            throw new BadRequestException("Unable to extract verified email from Google identity.");
        }

        String normalizedEmail = email.trim().toLowerCase();
        if (name == null || name.isBlank()) {
            name = normalizedEmail.split("@")[0];
        }

        Optional<User> existingUserOpt = userRepository.findByEmail(normalizedEmail);
        User user;

        if (existingUserOpt.isPresent()) {
            user = existingUserOpt.get();
            if (user.getOauthProvider() == null || user.getOauthProvider() == OAuthProvider.LOCAL) {
                user.setOauthProvider(OAuthProvider.GOOGLE);
            }
            if (sub != null && (user.getOauthId() == null || user.getOauthId().isBlank())) {
                user.setOauthId(sub);
            }
            user = userRepository.save(user);
            log.info("Google OAuth login for existing user [id={}, email={}]", user.getId(), user.getEmail());
        } else {
            user = User.builder()
                    .name(name)
                    .email(normalizedEmail)
                    .oauthProvider(OAuthProvider.GOOGLE)
                    .oauthId(sub)
                    .build();
            user = userRepository.save(user);
            log.info("Created new user via Google OAuth [id={}, email={}]", user.getId(), user.getEmail());
        }

        UserPrincipal principal = UserPrincipal.create(user);
        String accessToken = tokenProvider.generateAccessToken(principal);
        String refreshToken = tokenProvider.generateRefreshToken(principal);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(tokenProvider.getAccessExpirationMs() / 1000)
                .user(userMapper.toProfileResponse(user))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();

        if (!tokenProvider.validateToken(token)) {
            throw new BadRequestException("Invalid or expired refresh token. Please sign in again.");
        }

        Long userId = tokenProvider.getUserIdFromToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserPrincipal principal = UserPrincipal.create(user);
        String newAccessToken = tokenProvider.generateAccessToken(principal);
        String newRefreshToken = tokenProvider.generateRefreshToken(principal);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .expiresIn(tokenProvider.getAccessExpirationMs() / 1000)
                .user(userMapper.toProfileResponse(user))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + principal.getId()));
        return userMapper.toProfileResponse(user);
    }
}
