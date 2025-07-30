package com.rounders.pposeek.common.model.dto.kafka;

import lombok.Data;

@Data
public class AnalysisFeedback {
    private String userId;
    private String strengths;
    private String weaknesses;
    private String status;
}
