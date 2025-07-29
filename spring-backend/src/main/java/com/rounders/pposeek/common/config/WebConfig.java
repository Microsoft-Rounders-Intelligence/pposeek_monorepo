/*****************************************************************
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Spring MVC 웹 설정
 * - CORS 정책 설정
 * - 정적 리소스 매핑
 * - 인터셉터 등록 등
 * 
 * @author siunkimm@gmail.com
 * @since 2025
 * 
 * @apiNote
 * 2025	siunkimm	최초 작성<br/>
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    /**
     * CORS 설정 - 프론트엔드와의 통신 허용
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "http://localhost:3000",  // React 개발 서버
                    "http://localhost:3001",  // 추가 개발 서버
                    "https://yourdomain.com"  // 운영 도메인
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600); // preflight 요청 캐시 시간 (1시간)
    }

    /**
     * 정적 리소스 매핑 설정
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 업로드된 파일들을 위한 정적 리소스 경로
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
        
        // 정적 웹 리소스 (CSS, JS, Images 등)
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
    }
}
