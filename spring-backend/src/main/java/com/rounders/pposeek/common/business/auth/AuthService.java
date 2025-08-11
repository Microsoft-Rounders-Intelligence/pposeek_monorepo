/*****************************************************************
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.business.auth;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.rounders.pposeek.common.config.JwtConfig;
import com.rounders.pposeek.common.model.dto.auth.LoginDto;
import com.rounders.pposeek.common.model.dto.auth.RegisterDto;
import com.rounders.pposeek.common.model.dto.auth.TokenInfo;
import com.rounders.pposeek.common.model.dto.auth.UserSessionDto;
import com.rounders.pposeek.common.model.dto.user.UserDto;
import com.rounders.pposeek.common.persistence.auth.AuthPersistenceAdapter;

import java.util.List;

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
    @Transactional
    public TokenInfo login(LoginDto loginDto) {
        log.info("로그인 시도: {}", loginDto.getUsername());
        UserDto userDto = authPersistenceAdapter.selectUserForLogin(loginDto.getUsername());
        if (userDto == null) {
            log.warn("사용자를 찾을 수 없음: {}", loginDto.getUsername());
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }
        if (!passwordEncoder.matches(loginDto.getPassword(), userDto.getPasswordHash())) {
            log.warn("비밀번호 불일치: {}", loginDto.getUsername());
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }
        return generateAndBuildTokenInfo(userDto, loginDto.getSessionName() != null ? loginDto.getSessionName() : "Default Session");
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
    @Transactional
    public TokenInfo register(RegisterDto registerDto) {
        if (authPersistenceAdapter.checkUsernameDuplicate(registerDto.getEmail())) {
            throw new RuntimeException("이미 존재하는 사용자명입니다.");
        }
        if (authPersistenceAdapter.checkEmailDuplicate(registerDto.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }
        String encodedPassword = passwordEncoder.encode(registerDto.getPassword());
        UserDto userDto = UserDto.builder()
                .email(registerDto.getEmail())
                .passwordHash(encodedPassword)
                .name(registerDto.getName())  // 프론트엔드에서 보내는 name 필드 사용
                // role은 DB 기본값(user)을 사용하고, 백엔드에서는 설정하지 않음
                .build();
        authPersistenceAdapter.insertUser(userDto);
        log.info("insertUser 후 userId 확인: {}", userDto.getUserId());
        
        // userId가 null인 경우 오류 처리
        if (userDto.getUserId() == null) {
            log.error("사용자 등록 후 userId가 null입니다. MyBatis useGeneratedKeys 설정을 확인하세요.");
            throw new RuntimeException("사용자 등록에 실패했습니다. userId를 가져올 수 없습니다.");
        }
        
        log.info("회원가입 성공: email={}, 생성된 userId={}", userDto.getEmail(), userDto.getUserId());
        return generateAndBuildTokenInfo(userDto, "Default Session");
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
    public UserDto getCurrentUser(String token) {
        if (!jwtConfig.isTokenValid(token)) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }
        
        Integer userId = jwtConfig.extractUserId(token);
        return getCurrentUserById(userId);
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
            userDto.setPasswordHash(null);
            log.info("사용자 정보 조회 성공: userId={}, name={}", userId, userDto.getName());
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

    /**
     * 로그아웃.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param token JWT 토큰
     * @return 로그아웃 성공 여부
     */
    @Transactional
    public boolean logout(String token) {
        try {
            // 세션 비활성화
            int result = authPersistenceAdapter.deactivateSession(token);
            log.info("로그아웃 완료: token={}", token);
            return result > 0;
        } catch (Exception e) {
            log.error("로그아웃 실패: token={}", token, e);
            return false;
        }
    }

    /**
     * 사용자의 모든 세션 로그아웃.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param userId 사용자 ID
     * @return 로그아웃 성공 여부
     */
    @Transactional
    public boolean logoutAllSessions(Integer userId) {
        try {
            int result = authPersistenceAdapter.deactivateAllUserSessions(userId);
            log.info("모든 세션 로그아웃 완료: userId={}, 비활성화된 세션 수={}", userId, result);
            return result > 0;
        } catch (Exception e) {
            log.error("모든 세션 로그아웃 실패: userId={}", userId, e);
            return false;
        }
    }

    /**
     * 사용자의 활성 세션 목록 조회.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param userId 사용자 ID
     * @return 활성 세션 목록
     */
    public List<UserSessionDto> getActiveSessionsByUserId(Integer userId) {
        return authPersistenceAdapter.findActiveSessionsByUserId(userId);
    }

    /**
     * 세션 유효성 검증.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param sessionToken 세션 토큰
     * @return 유효성 여부
     */
    public boolean validateSession(String sessionToken) {
        return authPersistenceAdapter.validateSession(sessionToken);
    }

    /**
     * 만료된 세션 정리.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @return 정리된 세션 수
     */
    public int cleanupExpiredSessions() {
        return authPersistenceAdapter.cleanupExpiredSessions();
    }

    /**
     * 토큰 정보 생성 및 세션 생성.
     */
    private TokenInfo generateAndBuildTokenInfo(UserDto userDto, String sessionName) {
        String jwtToken = jwtConfig.generateToken(userDto.getUserId(), userDto.getName(), userDto.getEmail());
        log.info("JWT 토큰 생성 완료: userId={}", userDto.getUserId());
        
        // 세션 생성
        UserSessionDto sessionDto = new UserSessionDto(userDto.getUserId(), jwtToken, sessionName);
        authPersistenceAdapter.createSession(sessionDto);
        
        // 마지막 로그인 시간 업데이트
        authPersistenceAdapter.updateLastLogin(userDto.getUserId());
        
        userDto.setPasswordHash(null);
        return TokenInfo.builder()
                .grantType("Bearer")
                .accessToken(jwtToken)
                .expiresIn(jwtConfig.getExpiration())
                .userInfo(userDto)
                .build();
    }
}
