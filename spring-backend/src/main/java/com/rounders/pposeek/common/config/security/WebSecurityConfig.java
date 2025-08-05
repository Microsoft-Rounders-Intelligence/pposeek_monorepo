/*****************************************************************
 * 
 * PPoseek Web Application - Spring Security Configuration
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.config.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.rounders.pposeek.common.config.security.filter.JwtAuthenticationFilter;
import com.rounders.pposeek.common.config.security.service.CustomUserDetailsService;
import com.rounders.pposeek.common.utility.crypto.PPoseekPasswordEncoder;

import java.util.Arrays;

/**
 * Spring Security 환경 설정.
 * JWT + Redis 하이브리드 방식으로 인증/인가 처리
 * 
 * @author siunkimm@gmail.com
 * @since 2025
 * 
 * @apiNote
 * 2025	siunkimm	최초 작성 - JWT + Redis 하이브리드 방식<br/>
 */
@Slf4j
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // @PreAuthorize, @PostAuthorize 활성화
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final PPoseekPasswordEncoder pposeekPasswordEncoder;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    /**
     * 보안 필터 체인 설정.
     * 
     * @param http HttpSecurity 객체
     * @return SecurityFilterChain
     * @throws Exception
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        
        log.info("Spring Security 필터 체인 초기화 시작");

        http
            // CSRF 비활성화 (JWT 사용 시 불필요)
            .csrf(csrf -> csrf.disable())
            
            // CORS 설정
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 세션 정책: STATELESS (JWT 기반)
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // 인증/인가 규칙 설정
            .authorizeHttpRequests(authz -> authz
                // 공개 엔드포인트 (기존 AuthController 경로 포함)
                .requestMatchers(
                    "/actuator/**",
                    "/api/v1/auth/**",      // 기존 인증 API 경로
                    "/api/auth/**",         // 추가 인증 경로
                    "/api/public/**",       // 공개 API
                    "/ws/**",               // WebSocket 엔드포인트 
                    "/h2-console/**",       // H2 콘솔 (개발환경)
                    "/actuator/health",     // Health Check
                    "/swagger-ui/**",       // Swagger UI
                    "/v3/api-docs/**",      // OpenAPI 문서
                    "/error"                // 에러 페이지
                ).permitAll()
                
                // 관리자 전용 엔드포인트
                .requestMatchers("/api/admin/**", "/api/v1/admin/**").hasRole("ADMIN")
                
                // 기타 모든 요청은 인증 필요
                .anyRequest().authenticated()
            )
            
            // JWT 인증 필터 추가
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            
            // 인증 프로바이더 설정
            .authenticationProvider(authenticationProvider());

        // H2 콘솔 사용을 위한 설정 (개발환경)
        http.headers(headers -> headers.frameOptions(options -> options.sameOrigin()));

        log.info("Spring Security 필터 체인 초기화 완료");
        
        return http.build();
    }

    /**
     * CORS 설정.
     * 
     * @return CorsConfigurationSource
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // 허용할 오리진 설정
        configuration.setAllowedOrigins(Arrays.asList(frontendUrl, "http://localhost:3000"));
        
        // 허용할 HTTP 메서드
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        
        // 허용할 헤더
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // 자격 증명 허용 (쿠키, Authorization 헤더 등)
        configuration.setAllowCredentials(true);
        
        // preflight 요청 캐시 시간 (3600초 = 1시간)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        
        return source;
    }

    /**
     * 비밀번호 암호화 인코더.
     * 
     * @return PasswordEncoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return pposeekPasswordEncoder; // 커스텀 SHA-512 인코더 사용
    }

    /**
     * 인증 매니저.
     * 
     * @param config AuthenticationConfiguration
     * @return AuthenticationManager
     * @throws Exception
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * 인증 프로바이더 설정.
     * 
     * @return AuthenticationProvider
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(pposeekPasswordEncoder); // 커스텀 인코더 사용
        return authProvider;
    }
}
