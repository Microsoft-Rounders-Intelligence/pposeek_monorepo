package com.rounders.pposeek.common.business.kafka_ai;

import com.rounders.pposeek.common.model.dto.kafka.ResumeAnalysisRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaProducerService {
    private static final String TOPIC = "resume_analysis_request";
    private final KafkaTemplate<String, ResumeAnalysisRequest> kafkaTemplate;

    public void sendResumeAnalysisRequest(ResumeAnalysisRequest request) {
        System.out.println("Produce message: " + request.getFileUrl());
        this.kafkaTemplate.send(TOPIC, request);
    }
}
