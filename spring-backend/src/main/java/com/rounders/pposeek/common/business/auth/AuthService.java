/*****************************************************************
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.business.auth;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.rounders.pposeek.common.config.JwtConfig;
import com.rounders.pposeek.common.model.dto.auth.LoginDto;
import com.rounders.pposeek.common.model.dto.auth.RegisterDto;
import com.rounders.pposeek.common.model.dto.auth.TokenInfo;
import com.rounders.pposeek.common.model.dto.user.UserDto;
import com.rounders.pposeek.common.persistence.auth.AuthPersistenceAdapter;

import java.util.UUID;

/**
 * 인증 업무를 처리하는 비즈니스 서비스.
 * 
 * @author siunkimm@gmail.com
 * @since 2025
 * 
 * @apiNote
 * 2025	siunkimm	최초 작성<br/>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthPersistenceAdapter authPersistenceAdapter;
    private final JwtConfig jwtConfig;
    private final PasswordEncoder passwordEncoder;

    /**
     * 사용자 로그인.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param loginDto 로그인 정보
     * @return 토큰 정보
     */
    public TokenInfo login(LoginDto loginDto) {
        log.info("로그인 시도: {}", loginDto.getUsername());
        
        // 사용자 정보 조회 (사용자명 또는 이메일로)
        UserDto userDto = authPersistenceAdapter.selectUserForLogin(loginDto.getUsername());
        
        if (userDto == null) {
            log.warn("사용자를 찾을 수 없음: {}", loginDto.getUsername());
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }

        if (!userDto.getIsActive()) {
            log.warn("비활성화된 사용자: {}", loginDto.getUsername());
            throw new RuntimeException("비활성화된 사용자입니다.");
        }
        
        // 비밀번호 검증 (Spring Security PasswordEncoder 사용)
        if (!passwordEncoder.matches(loginDto.getPassword(), userDto.getPasswordHash())) {
            log.warn("비밀번호 불일치: {}", loginDto.getUsername());
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }
        
        // 로그인 기록용 세션 저장 (선택사항)
        String sessionToken = UUID.randomUUID().toString();
        authPersistenceAdapter.insertUserSession(userDto.getUserId(), sessionToken, "Login Session");
        
        // JWT 토큰 생성 (사용자 정보를 암호화해서 토큰에 담음)
        String jwtToken = jwtConfig.generateToken(
            userDto.getUserId(), 
            userDto.getUsername(), 
            userDto.getEmail()
        );
        
        log.info("JWT 토큰 생성 완료: userId={}", userDto.getUserId());
        
        return TokenInfo.builder()
                .grantType("Bearer")
                .accessToken(jwtToken)  // 실제 JWT 토큰 반환
                .expiresIn(86400L)      // 24시간
                .build();
    }

    /**
     * 사용자 회원가입.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param registerDto 회원가입 정보
     * @return 등록된 사용자 정보
     */
    public UserDto register(RegisterDto registerDto) {
        // 사용자명 중복 체크
        if (authPersistenceAdapter.checkUsernameDuplicate(registerDto.getUsername())) {
            throw new RuntimeException("이미 존재하는 사용자명입니다.");
        }
        
        // 이메일 중복 체크
        if (authPersistenceAdapter.checkEmailDuplicate(registerDto.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }
        
        // 비밀번호 암호화 (Spring Security PasswordEncoder 사용)
        String encodedPassword = passwordEncoder.encode(registerDto.getPassword());
        
        // 사용자 정보 생성
        UserDto userDto = UserDto.builder()
                .username(registerDto.getUsername())
                .email(registerDto.getEmail())
                .userId(registerDto.getUserId())
                .passwordHash(encodedPassword)
                .displayName(registerDto.getDisplayName() != null ? registerDto.getDisplayName() : registerDto.getUsername())
                .role("USER") // 기본 역할 설정
                .isActive(true)
                .build();
        
        // 사용자 등록
        authPersistenceAdapter.insertUser(userDto);
        
        // 비밀번호 정보는 반환하지 않음
        userDto.setPasswordHash(null);
        return userDto;
    }

    /**
     * 현재 사용자 정보 조회.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param token JWT 토큰
     * @return 사용자 정보
     */
    // 기존 메서드를 이렇게 수정
    public UserDto getCurrentUser(String token) {
        if (!jwtConfig.isTokenValid(token)) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }
        
        Integer userId = jwtConfig.extractUserId(token);
        return getCurrentUserById(userId); // 새로 만든 메서드 재사용
    }

        /**
     * 사용자 ID로 현재 사용자 정보 조회.
     * 
     * @param userId 사용자 ID
     * @return 사용자 정보
     */
    public UserDto getCurrentUserById(Integer userId) {
        log.info("사용자 ID로 정보 조회: {}", userId);
        
        UserDto userDto = authPersistenceAdapter.selectUserById(userId);
        if (userDto != null) {
            // 비밀번호 정보는 반환하지 않음
            userDto.setPasswordHash(null);
            log.info("사용자 정보 조회 성공: userId={}, username={}", userId, userDto.getUsername());
        } else {
            log.warn("사용자 정보를 찾을 수 없음: userId={}", userId);
        }
        
        return userDto;
    }

    /**
     * 사용자명 중복 체크.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param username 사용자명
     * @return 중복 여부
     */
    public boolean checkUsernameDuplicate(String username) {
        return authPersistenceAdapter.checkUsernameDuplicate(username);
    }
}
