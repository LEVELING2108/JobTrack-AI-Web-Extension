package com.jobtrack.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Origin platform where the job posting was discovered.
 */
public enum JobSource {
    LINKEDIN,
    INDEED,
    GLASSDOOR,
    COMPANY_WEBSITE,
    GENERIC,
    OTHER;

    @JsonCreator
    public static JobSource fromString(String value) {
        if (value == null || value.isBlank()) {
            return OTHER;
        }
        String normalized = value.trim().toUpperCase();
        if (normalized.contains("LINKEDIN")) {
            return LINKEDIN;
        }
        if (normalized.contains("INDEED")) {
            return INDEED;
        }
        if (normalized.contains("GLASSDOOR")) {
            return GLASSDOOR;
        }
        if (normalized.contains("COMPANY") || normalized.contains("CAREER") || normalized.contains("PORTAL")) {
            return COMPANY_WEBSITE;
        }
        if (normalized.contains("GENERIC") || normalized.contains("JSON_LD") || normalized.contains("OPEN_GRAPH") || normalized.contains("DOM")) {
            return GENERIC;
        }
        try {
            return JobSource.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            return OTHER;
        }
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}
