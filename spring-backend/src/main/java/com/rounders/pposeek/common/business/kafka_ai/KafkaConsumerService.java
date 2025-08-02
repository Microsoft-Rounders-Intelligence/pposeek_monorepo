package com.rounders.pposeek.common.business.kafka_ai;
import lombok.extern.slf4j.Slf4j; // 로깅 하기 위한 SLF4J 임포트
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rounders.pposeek.common.model.dto.kafka.AnalysisFeedback;
import com.rounders.pposeek.common.model.dto.kafka.Notification;
import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j // SLF4J 로깅을 위한 어노테이션
@Service
@RequiredArgsConstructor
public class KafkaConsumerService {

    // 웹소켓 메시지를 보내기 위한 템플릿 주입
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "analysis_feedback_topic", containerFactory = "kafkaListenerContainerFactory")
    public void consumeFeedback(Map<String, Object> feedbackMap) {
        try {
            log.info("📨 Received feedback map {} ", feedbackMap);
            
            // Map을 AnalysisFeedback DTO로 변환
            AnalysisFeedback feedback = objectMapper.convertValue(feedbackMap, AnalysisFeedback.class);
            
            log.info("✅ Converted to DTO for user {} ", feedback.getUserId());
            
            // 사용자별 WebSocket 채널로 피드백 전송
            messagingTemplate.convertAndSendToUser(
                feedback.getUserId(), 
                "/queue/feedback", 
                feedback
            );
            
            log.info("✅ Feedback sent to user {}", feedback.getUserId());
            log.info("메시지 템플릿 내용 {} ",messagingTemplate);
            
        } catch (Exception e) {
            log.error("❌ Error processing feedback " + e.getMessage() +  e);
        }
    }

    @KafkaListener(topics = "notification_topic", containerFactory = "kafkaListenerContainerFactory")
    public void consumeNotification(Map<String, Object> notificationMap) {
        try {
            log.info("🔔 Received notification map {}", notificationMap);
            
            // Map을 Notification DTO로 변환
            Notification notification = objectMapper.convertValue(notificationMap, Notification.class);
            
            log.info("✅ Converted to DTO for user {} ", notification.getUserId());
            
            // 사용자별 WebSocket 채널로 알림 전송
            messagingTemplate.convertAndSendToUser(
                notification.getUserId(), 
                "/queue/notifications", 
                notification
            );
            log.info("메시지 템플릿 내용 : " + messagingTemplate);
            
            log.info("✅ Notification sent to user " + notification.getUserId());
            
        } catch (Exception e) {
            log.error("❌ Error processing notification: {}" + e.getMessage() + e);
        }
    }
}
