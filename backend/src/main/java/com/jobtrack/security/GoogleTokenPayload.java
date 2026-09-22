package com.jobtrack.security;

import lombok.Builder;

@Builder
public record GoogleTokenPayload(
        String email,
        String name,
        String sub,
        boolean emailVerified
) {}
