/*****************************************************************
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.rounders.pposeek.common.utility.crypto.key.SecureKeyManager;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * 간단한 JWT 토큰 관리 클래스.
 * SecureKeyManager를 통해 안전한 키 관리
 * 
 * @author siunkimm@gmail.com
 * @since 2025
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtConfig {

    private final SecureKeyManager secureKeyManager;

    @Value("${jwt.expiration:86400}") // 24시간 (초 단위)
    private Long expiration;

    private SecretKey getSigningKey() {
        String jwtSecret = secureKeyManager.getJwtSecret();
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public long getExpiration() {
        return expiration;
    }

    /**
     * 로그인 시 JWT 토큰 생성
     * 사용자 정보를 암호화해서 토큰에 담음
     */
    public String generateToken(Integer userId, String username, String email) {
        return Jwts.builder()
                .claim("user_id", userId)
                .claim("username", username)
                .claim("email", email)
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration * 1000))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * 토큰에서 사용자 정보 추출
     */
    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * 토큰 유효성 검증
     */
    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 토큰에서 사용자 ID 추출
     */
    public Integer extractUserId(String token) {
        Claims claims = extractClaims(token);
        return claims.get("user_id", Integer.class);
    }
}
