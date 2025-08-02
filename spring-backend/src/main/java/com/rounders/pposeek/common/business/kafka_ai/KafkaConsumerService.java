package com.rounders.pposeek.common.business.kafka_ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rounders.pposeek.common.model.dto.kafka.AnalysisFeedback;
import com.rounders.pposeek.common.model.dto.kafka.Notification;
import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaConsumerService {

    // 웹소켓 메시지를 보내기 위한 템플릿 주입
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "analysis_feedback_topic", containerFactory = "kafkaListenerContainerFactory")
    public void consumeFeedback(Map<String, Object> feedbackMap) {
        try {
            System.out.println("📨 Received feedback map: " + feedbackMap);
            
            // Map을 AnalysisFeedback DTO로 변환
            AnalysisFeedback feedback = objectMapper.convertValue(feedbackMap, AnalysisFeedback.class);
            
            System.out.println("✅ Converted to DTO for user: " + feedback.getUserId());
            
            // 사용자별 WebSocket 채널로 피드백 전송
            messagingTemplate.convertAndSendToUser(
                feedback.getUserId(), 
                "/queue/feedback", 
                feedback
            );
            
            System.out.println("✅ Feedback sent to user " + feedback.getUserId());
            System.out.println("메시지 템플릿 내용 : " + messagingTemplate);
            
        } catch (Exception e) {
            System.out.println("❌ Error processing feedback " + e.getMessage() +  e);
        }
    }

    @KafkaListener(topics = "notification_topic", containerFactory = "kafkaListenerContainerFactory")
    public void consumeNotification(Map<String, Object> notificationMap) {
        try {
            System.out.println("🔔 Received notification map: " + notificationMap);
            
            // Map을 Notification DTO로 변환
            Notification notification = objectMapper.convertValue(notificationMap, Notification.class);
            
            System.out.println("✅ Converted to DTO for user:" + notification.getUserId());
            
            // 사용자별 WebSocket 채널로 알림 전송
            messagingTemplate.convertAndSendToUser(
                notification.getUserId(), 
                "/queue/notifications", 
                notification
            );
            System.out.println("메시지 템플릿 내용 : " + messagingTemplate);
            
            System.out.println("✅ Notification sent to user " + notification.getUserId());
            
        } catch (Exception e) {
            System.out.println("❌ Error processing notification: {}" + e.getMessage() + e);
        }
    }
}
