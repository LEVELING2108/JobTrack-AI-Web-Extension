package com.jobtrack.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobtrack.exception.UnauthorizedException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Slf4j
@Service
public class GoogleTokenVerifierServiceImpl implements GoogleTokenVerifierService {

    private static final String GOOGLE_TOKENINFO_URL = "https://oauth2.googleapis.com/tokeninfo?id_token={idToken}";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String expectedClientId;

    public GoogleTokenVerifierServiceImpl(
            RestTemplateBuilder restTemplateBuilder,
            ObjectMapper objectMapper,
            @Value("${app.google.client-id:}") String expectedClientId) {
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(5))
                .setReadTimeout(Duration.ofSeconds(5))
                .build();
        this.objectMapper = objectMapper;
        this.expectedClientId = expectedClientId != null ? expectedClientId.trim() : "";
    }

    @Override
    public GoogleTokenPayload verify(String idTokenString) {
        if (idTokenString == null || idTokenString.isBlank()) {
            throw new UnauthorizedException("Google ID token is required.");
        }

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(
                    GOOGLE_TOKENINFO_URL,
                    String.class,
                    idTokenString
            );

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new UnauthorizedException("Failed to verify Google ID token with Google identity service.");
            }

            JsonNode root = objectMapper.readTree(response.getBody());

            // Validate issuer
            String iss = root.path("iss").asText("");
            if (!iss.equals("accounts.google.com") && !iss.equals("https://accounts.google.com")) {
                log.warn("Invalid Google token issuer: {}", iss);
                throw new UnauthorizedException("Invalid Google token issuer.");
            }

            // Validate audience if configured
            if (!expectedClientId.isBlank()) {
                String aud = root.path("aud").asText("");
                if (!expectedClientId.equals(aud)) {
                    log.warn("Google token audience mismatch: expected={}, received={}", expectedClientId, aud);
                    throw new UnauthorizedException("Google token was not issued for this application.");
                }
            }

            // Validate email verification status
            boolean emailVerified = root.path("email_verified").asBoolean(false) ||
                    "true".equalsIgnoreCase(root.path("email_verified").asText(""));
            if (!emailVerified) {
                throw new UnauthorizedException("Google account email address is not verified.");
            }

            String email = root.path("email").asText(null);
            if (email == null || email.isBlank()) {
                throw new UnauthorizedException("No email address provided in verified Google identity.");
            }

            String name = root.path("name").asText(null);
            String sub = root.path("sub").asText(null);

            return GoogleTokenPayload.builder()
                    .email(email)
                    .name(name)
                    .sub(sub)
                    .emailVerified(true)
                    .build();

        } catch (HttpStatusCodeException e) {
            log.warn("Google tokeninfo returned HTTP {}: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new UnauthorizedException("Google rejected the provided identity token: " + e.getStatusText());
        } catch (UnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error validating Google ID token: {}", e.getMessage(), e);
            throw new UnauthorizedException("Unable to verify Google identity token. Please try again.");
        }
    }
}
