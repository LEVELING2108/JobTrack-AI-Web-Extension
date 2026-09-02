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
public class AiInterviewPrepResponse {
    private List<InterviewQuestionItem> questions;
    private List<String> keyThemes;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InterviewQuestionItem {
        private String question;
        private String category;
        private String tip;
        private String suggestedAnswerStrategy;
    }
}
