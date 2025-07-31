package com.rounders.pposeek.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 클라이언트가 구독할 경로(prefix) 설정
        config.enableSimpleBroker("/topic", "/queue");
        // 메시지를 보낼 때 사용할 경로(prefix) 설정
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 웹소켓 연결을 위한 엔드포인트 설정
        // CORS 문제를 해결하기 위해 setAllowedOrigins에 정확한 주소를 명시합니다.
        registry.addEndpoint("/ws")
            .setAllowedOrigins("http://localhost", "http://localhost:3000") // "*" 대신 정확한 주소 사용
            .withSockJS();
    }
}