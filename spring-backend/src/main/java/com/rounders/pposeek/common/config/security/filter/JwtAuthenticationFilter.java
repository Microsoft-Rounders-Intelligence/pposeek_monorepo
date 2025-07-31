/*****************************************************************
 * 
 * PPoseek Web Application - JWT Authentication Filter
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.config.security.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.rounders.pposeek.common.config.JwtConfig;

import java.io.IOException;

/**
 * JWT 토큰 기반 인증 필터.
 * 매 요청마다 JWT 토큰을 검증하고 Spring Security Context에 인증 정보를 설정
 * 
 * @author siunkimm@gmail.com
 * @since 2025
 * 
 * @apiNote
 * 2025	siunkimm	최초 작성<br/>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtConfig jwtConfig;
    private final UserDetailsService userDetailsService;

    private static final String BEARER_PREFIX = "Bearer ";
    private static final String AUTHORIZATION_HEADER = "Authorization";

    /**
     * JWT 토큰 인증 필터 처리.
     * 
     * @param request HTTP 요청
     * @param response HTTP 응답
     * @param filterChain 필터 체인
     * @throws ServletException
     * @throws IOException
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        try {
            // JWT 토큰 추출
            String jwt = getJwtFromRequest(request);
            
            if (StringUtils.hasText(jwt) && jwtConfig.isTokenValid(jwt)) {
                // 토큰에서 사용자 ID 추출
                Integer userIdInt = jwtConfig.extractUserId(jwt);
                String userId = userIdInt != null ? userIdInt.toString() : null;
                
                log.debug("JWT 토큰에서 추출된 사용자 ID: {}", userId);
                
                // 현재 인증 정보가 없는 경우에만 처리
                if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    
                    // UserDetails 로드
                    UserDetails userDetails = userDetailsService.loadUserByUsername(userId);
                    
                    if (userDetails != null) {
                        // 인증 토큰 생성
                        UsernamePasswordAuthenticationToken authToken = 
                            new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                            );
                        
                        // 요청 세부 정보 설정
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        
                        // Security Context에 인증 정보 설정
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        
                        log.debug("사용자 '{}' 인증 완료", userId);
                    }
                }
            }
        } catch (Exception e) {
            log.error("JWT 인증 처리 중 오류 발생: {}", e.getMessage(), e);
            // 인증 실패 시에도 필터 체인은 계속 진행
            SecurityContextHolder.clearContext();
        }

        // 다음 필터로 진행
        filterChain.doFilter(request, response);
    }

    /**
     * HTTP 요청에서 JWT 토큰 추출.
     * 
     * @param request HTTP 요청
     * @return JWT 토큰 (Bearer 접두사 제거)
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(BEARER_PREFIX)) {
            return bearerToken.substring(BEARER_PREFIX.length());
        }
        
        return null;
    }

    /**
     * 필터를 적용하지 않을 요청 경로 판별.
     * 
     * @param request HTTP 요청
     * @return 필터 스킵 여부
     * @throws ServletException
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        
        // 인증이 필요 없는 경로들 (기존 AuthController 경로 포함)
        return path.startsWith("/api/v1/auth/") ||     // 기존 인증 API
               path.startsWith("/api/auth/") ||        // 추가 인증 API
               path.startsWith("/api/public/") ||
               path.startsWith("/h2-console/") ||
               path.startsWith("/actuator/health") ||
               path.startsWith("/swagger-ui/") ||
               path.startsWith("/v3/api-docs/") ||
               path.equals("/error");
    }
}
