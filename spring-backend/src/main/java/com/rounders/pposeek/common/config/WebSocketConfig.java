package com.rounders.pposeek.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.security.Principal;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 클라이언트가 구독할 경로(prefix) 설정
        config.enableSimpleBroker("/topic", "/queue","/user");
        // 메시지를 보낼 때 사용할 경로(prefix) 설정
        config.setApplicationDestinationPrefixes("/app");

        // 사용자별 메시지를 위한 설정 - 이게 핵심!
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 웹소켓 연결을 위한 엔드포인트 설정
        // CORS 문제를 해결하기 위해 setAllowedOrigins에 정확한 주소를 명시합니다.
        registry.addEndpoint("/ws")
            .setAllowedOrigins("http://localhost", "http://localhost:3000") // "*" 대신 정확한 주소 사용
            .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    // JWT 토큰에서 사용자 ID 추출 (URL 파라미터에서)
                    String userId = accessor.getFirstNativeHeader("userId");
                    
                    if (userId != null) {
                        // 사용자 Principal 설정
                        accessor.setUser(new Principal() {
                            @Override
                            public String getName() {
                                return userId;
                            }
                        });
                        System.out.println("🔗 WebSocket connected for user: " + userId);
                    }
                }
                return message;
            }
        });
    }
}