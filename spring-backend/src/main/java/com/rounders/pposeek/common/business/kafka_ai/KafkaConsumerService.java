package com.rounders.pposeek.common.business.kafka_ai;

import com.rounders.pposeek.common.model.dto.kafka.AnalysisFeedback;
import com.rounders.pposeek.common.model.dto.kafka.Notification;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {
    @KafkaListener(topics = "analysis_feedback_topic", containerFactory = "kafkaListenerContainerFactory")
    public void consumeFeedback(AnalysisFeedback feedback) {
        System.out.println("Consumed feedback: " + feedback.toString());
        // TODO: 여기서 받은 피드백을 처리하는 로직 구현
    }

    @KafkaListener(topics = "notification_topic", containerFactory = "kafkaListenerContainerFactory")
    public void consumeNotification(Notification notification) {
        System.out.println("Consumed notification: " + notification.getMessage());
        // TODO: 여기서 받은 알림을 처리하는 로직 구현
    }
}
