package com.jobtrack.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoogleAuthRequest {

    @NotBlank(message = "Google ID token or credential is required")
    private String idToken;

    // Optional direct fallback fields if client already decoded profile
    private String email;
    private String name;
    private String avatarUrl;
}
