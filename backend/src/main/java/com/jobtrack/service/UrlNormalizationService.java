package com.jobtrack.service;

import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Normalizes job URLs by removing transient marketing & tracking parameters
 * (e.g. utm_*, refId, trackingId, fbclid) while preserving required job identifiers.
 */
@Service
public class UrlNormalizationService {

    private static final Set<String> TRACKING_PARAMS = Set.of(
            "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
            "refid", "trackingid", "midtoken", "trk", "trkinfo", "tracking_id",
            "fbclid", "gclid", "sc_src", "source", "ref", "context", "position", "pagenum"
    );

    public String normalize(String rawUrl) {
        if (rawUrl == null || rawUrl.isBlank()) {
            return "";
        }

        try {
            URI uri = URI.create(rawUrl.trim());
            String host = uri.getHost() != null ? uri.getHost().toLowerCase() : "";
            String path = uri.getPath() != null ? uri.getPath() : "";
            String query = uri.getQuery();

            // Handle LinkedIn specific canonicalization
            if (host.contains("linkedin.com") && query != null && query.contains("currentJobId=")) {
                String jobId = extractQueryParam(query, "currentJobId");
                if (jobId != null && !jobId.isBlank()) {
                    return "https://www.linkedin.com/jobs/view/" + jobId;
                }
            }

            // Handle Indeed specific canonicalization
            if (host.contains("indeed.com") && query != null && (query.contains("jk=") || query.contains("vjk="))) {
                String jk = extractQueryParam(query, "jk");
                if (jk == null || jk.isBlank()) {
                    jk = extractQueryParam(query, "vjk");
                }
                if (jk != null && !jk.isBlank()) {
                    return "https://www.indeed.com/viewjob?jk=" + jk;
                }
            }

            // Strip tracking parameters
            StringBuilder cleanQuery = new StringBuilder();
            if (query != null && !query.isBlank()) {
                String[] pairs = query.split("&");
                for (String pair : pairs) {
                    int idx = pair.indexOf("=");
                    String key = idx > 0 ? pair.substring(0, idx) : pair;
                    if (!TRACKING_PARAMS.contains(key.toLowerCase())) {
                        if (cleanQuery.length() > 0) cleanQuery.append("&");
                        cleanQuery.append(pair);
                    }
                }
            }

            // Remove trailing slash if not root
            if (path.length() > 1 && path.endsWith("/")) {
                path = path.substring(0, path.length() - 1);
            }

            String scheme = uri.getScheme() != null ? uri.getScheme().toLowerCase() : "https";
            return scheme + "://" + host + path + (cleanQuery.length() > 0 ? "?" + cleanQuery : "");
        } catch (Exception e) {
            return rawUrl.split("#")[0];
        }
    }

    private String extractQueryParam(String query, String targetKey) {
        String[] pairs = query.split("&");
        for (String pair : pairs) {
            String[] kv = pair.split("=");
            if (kv.length == 2 && kv[0].equalsIgnoreCase(targetKey)) {
                return URLDecoder.decode(kv[1], StandardCharsets.UTF_8);
            }
        }
        return null;
    }
}
