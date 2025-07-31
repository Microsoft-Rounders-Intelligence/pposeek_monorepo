/*****************************************************************
 * 
 * PPoseek Web Application - Security Authentication Controller
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.rounders.pposeek.common.business.auth.AuthService;
import com.rounders.pposeek.common.config.JwtConfig;
import com.rounders.pposeek.common.model.dto.auth.LoginDto;
import com.rounders.pposeek.common.model.dto.auth.RegisterDto;
import com.rounders.pposeek.common.model.dto.auth.TokenInfo;
import com.rounders.pposeek.common.model.dto.user.UserDto;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

/**
 * Spring Security 기반 인증 컨트롤러.
 * 로그인, 회원가입, 토큰 갱신 등의 인증 관련 엔드포인트 제공
 * 
 * @author siunkimm@gmail.com
 * @since 2025
 * 
 * @apiNote
 * 2025	siunkimm	최초 작성 - Spring Security 연동<br/>
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class SecurityAuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtConfig jwtConfig;

    /**
     * 사용자 로그인 (Spring Security 인증).
     * 
     * @param loginDto 로그인 정보
     * @return 인증 토큰 정보
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDto loginDto) {
        log.info("Spring Security 로그인 시도: {}", loginDto.getUsername());
        
        try {
            // Spring Security Authentication Manager를 통한 인증
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginDto.getUsername(),
                    loginDto.getPassword()
                )
            );
            
            // 인증 성공 시 Security Context에 설정
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // JWT 토큰 생성을 위해 기존 AuthService 활용
            TokenInfo tokenInfo = authService.login(loginDto);
            // 디버깅을 위한 로그 추가
            log.info("로그인 응답 토큰 정보: grantType={}, accessToken={}, refreshToken={}", 
            tokenInfo.getGrantType(), 
            tokenInfo.getAccessToken() != null ? "있음" : "없음",
            tokenInfo.getRefreshToken() != null ? "있음" : "없음");
            
            log.info("Spring Security 로그인 성공: {}", loginDto.getUsername());
            
            return ResponseEntity.ok(tokenInfo);
            
        } catch (AuthenticationException e) {
            log.warn("Spring Security 로그인 실패: {} - {}", loginDto.getUsername(), e.getMessage());
            return ResponseEntity.badRequest()
                .body("로그인에 실패했습니다: " + e.getMessage());
        } catch (Exception e) {
            log.error("로그인 처리 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body("로그인 처리 중 오류가 발생했습니다.");
        }
    }

    /**
     * 사용자 회원가입.
     * 
     * @param registerDto 회원가입 정보
     * @return 가입 결과
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDto registerDto) {
        log.info("회원가입 시도: {}", registerDto.getUsername());
        
        try {
            UserDto user = authService.register(registerDto);
            
            log.info("회원가입 성공: {}", registerDto.getUsername());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
            
        } catch (Exception e) {
            log.error("회원가입 처리 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body("회원가입에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 현재 인증된 사용자 정보 조회.
     * 
     * @return 사용자 정보
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        try {
            // Authorization 헤더에서 JWT 토큰 추출
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("인증 토큰이 없습니다.");
            }
            
            String token = authHeader.substring(7); // "Bearer " 제거
            
            // JWT 토큰에서 직접 userId 추출
            if (!jwtConfig.isTokenValid(token)) {
                return ResponseEntity.status(401).body("유효하지 않은 토큰입니다.");
            }
            
            Integer userId = jwtConfig.extractUserId(token); // 🎯 userId 직접 추출
            log.debug("JWT에서 추출된 사용자 ID: {}", userId);
            
            UserDto user = authService.getCurrentUserById(userId); // 🎯 userId로 조회
            
            if (user == null) {
                return ResponseEntity.notFound().build();
            }
            
            log.debug("현재 사용자 정보 조회: {}", user.getUsername());
            return ResponseEntity.ok(user);
            
        } catch (Exception e) {
            log.error("사용자 정보 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body("사용자 정보를 조회할 수 없습니다.");
        }
    }

    /**
     * 로그아웃.
     * JWT 방식에서는 클라이언트에서 토큰을 제거하면 되지만,
     * 필요시 서버에서 토큰 블랙리스트 관리 가능
     * 
     * @return 로그아웃 결과
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        try {
            // Security Context 클리어
            SecurityContextHolder.clearContext();
            
            log.info("로그아웃 처리 완료");
            
            return ResponseEntity.ok("로그아웃되었습니다.");
            
        } catch (Exception e) {
            log.error("로그아웃 처리 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                .body("로그아웃 처리 중 오류가 발생했습니다.");
        }
    }

    /**
     * 토큰 유효성 검증.
     * 
     * @param token JWT 토큰
     * @return 검증 결과
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestParam String token) {
        try {
            boolean isValid = jwtConfig.isTokenValid(token);
            
            if (isValid) {
                Integer userId = jwtConfig.extractUserId(token);
                return ResponseEntity.ok()
                    .body("토큰이 유효합니다. 사용자 ID: " + userId);
            } else {
                return ResponseEntity.badRequest()
                    .body("유효하지 않은 토큰입니다.");
            }
            
        } catch (Exception e) {
            log.error("토큰 검증 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                .body("토큰 검증에 실패했습니다.");
        }
    }
}
