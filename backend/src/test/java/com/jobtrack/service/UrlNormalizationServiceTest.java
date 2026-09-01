package com.jobtrack.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class UrlNormalizationServiceTest {

    private UrlNormalizationService normalizer;

    @BeforeEach
    void setUp() {
        normalizer = new UrlNormalizationService();
    }

    @Test
    @DisplayName("Should strip UTM and tracking query parameters from job URL")
    void testStripUtmParameters() {
        String raw = "https://example.com/careers/software-engineer?utm_source=linkedin&utm_medium=cpc&utm_campaign=hiring2026";
        String normalized = normalizer.normalize(raw);
        assertEquals("https://example.com/careers/software-engineer", normalized);
    }

    @Test
    @DisplayName("Should canonicalize LinkedIn search currentJobId to direct job view URL")
    void testCanonicalizeLinkedInUrl() {
        String raw = "https://www.linkedin.com/jobs/search/?currentJobId=4012345678&keywords=java+developer";
        String normalized = normalizer.normalize(raw);
        assertEquals("https://www.linkedin.com/jobs/view/4012345678", normalized);
    }

    @Test
    @DisplayName("Should canonicalize Indeed vjk parameter to canonical viewjob URL")
    void testCanonicalizeIndeedUrl() {
        String raw = "https://www.indeed.com/jobs?q=fullstack&l=remote&vjk=abc12345def";
        String normalized = normalizer.normalize(raw);
        assertEquals("https://www.indeed.com/viewjob?jk=abc12345def", normalized);
    }

    @Test
    @DisplayName("Should remove trailing slashes from path")
    void testRemoveTrailingSlash() {
        String raw = "https://jobs.lever.co/company-name/senior-engineer/";
        String normalized = normalizer.normalize(raw);
        assertEquals("https://jobs.lever.co/company-name/senior-engineer", normalized);
    }
}
