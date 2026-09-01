package com.jobtrack.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationSummaryResponse {
    private long total;
    private long saved;
    private long applied;
    private long screening;
    private long interview;
    private long offer;
    private long accepted;
    private long rejected;
    private long withdrawn;
}
