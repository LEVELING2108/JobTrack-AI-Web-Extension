package com.jobtrack.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiMatchScoreResponse {
    private int matchScore;
    private String summary;
    private List<String> matchingSkills;
    private List<String> missingSkills;
    private List<String> recommendations;
}
