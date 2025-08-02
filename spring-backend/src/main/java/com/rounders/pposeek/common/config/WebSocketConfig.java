package com.rounders.pposeek.common.config;
import com.rounders.pposeek.common.config.JwtConfig;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.util.StringUtils;
import lombok.RequiredArgsConstructor; // ⭐️ Lombok 어노테이션 임포트
import lombok.extern.slf4j.Slf4j; // ⭐️ Lombok 로그 어노테이션 임포트


@Slf4j // ⭐️ 로그를 사용하기 위해 추가
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private final JwtConfig jwtConfig;
    private final UserDetailsService userDetailsService;
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 클라이언트가 구독할 경로(prefix) 설정
        config.enableSimpleBroker("/topic", "/queue");
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
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                // STOMP CONNECT 요청일 때만 JWT 인증을 수행합니다.
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String bearerToken = accessor.getFirstNativeHeader("Authorization");
                    System.out.println("WebSocket received Authorization header : " + bearerToken);

                    // ⭐️ 2. JwtAuthenticationFilter의 로직을 거의 그대로 사용합니다.
                    if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
                        String jwt = bearerToken.substring(7);
                        try {
                            if (jwtConfig.isTokenValid(jwt)) {
                                Integer userIdInt = jwtConfig.extractUserId(jwt);
                                String userId = userIdInt != null ? String.valueOf(userIdInt) : null;

                                if (userId != null) {
                                    // UserDetailsService를 통해 UserDetails를 가져옵니다.
                                    UserDetails userDetails = userDetailsService.loadUserByUsername(userId);
                                    
                                    // 인증 토큰을 생성합니다.
                                    UsernamePasswordAuthenticationToken authentication =
                                            new UsernamePasswordAuthenticationToken(
                                                    userDetails,
                                                    null,
                                                    userDetails.getAuthorities()
                                            );
                                    
                                    // 웹소켓 세션에 인증된 사용자를 설정합니다.
                                    accessor.setUser(authentication);
                                    System.out.println("✅ WebSocket User Authenticated: " + userId);
                                }
                            }
                        } catch (Exception e) {
                            System.out.println("WebSocket JWT Authentication error:" + e.getMessage());
                        }
                    }
                }
                return message;
            }
        });
    }
}