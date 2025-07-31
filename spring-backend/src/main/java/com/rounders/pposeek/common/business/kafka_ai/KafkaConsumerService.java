package com.rounders.pposeek.common.business.kafka_ai;

import com.rounders.pposeek.common.model.dto.kafka.AnalysisFeedback;
import com.rounders.pposeek.common.model.dto.kafka.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaConsumerService {

    // 웹소켓 메시지를 보내기 위한 템플릿 주입
    private final SimpMessagingTemplate messagingTemplate;


    @KafkaListener(topics = "analysis_feedback_topic", containerFactory = "kafkaListenerContainerFactory")
    public void consumeFeedback(AnalysisFeedback feedback) {
        System.out.println("Consumed feedback: " + feedback.toString());
        // TODO: 여기서 받은 피드백을 처리하는 로직 구현 피드백 메시지. 
        messagingTemplate.convertAndSendToUser(feedback.getUserId(), "/queue/feedback", feedback);
    }

    @KafkaListener(topics = "notification_topic", containerFactory = "kafkaListenerContainerFactory")
    public void consumeNotification(Notification notification) {
        System.out.println("Consumed notification: " + notification.getMessage());
        // TODO: 여기서 받은 알림을 처리하는 로직 구현 
        messagingTemplate.convertAndSendToUser(notification.getUserId(), "/queue/notifications", notification);
    }
}
