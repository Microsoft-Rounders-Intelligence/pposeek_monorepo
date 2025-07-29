/*****************************************************************
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.business.auth;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

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
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthPersistenceAdapter authPersistenceAdapter;

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
        // 사용자 정보 조회 (사용자명 또는 이메일로)
        UserDto userDto = authPersistenceAdapter.selectUserForLogin(loginDto.getUsername());
        
        if (userDto == null) {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }

        if (!userDto.getIsActive()) {
            throw new RuntimeException("비활성화된 사용자입니다.");
        }
        
        // 비밀번호 검증 (임시로 단순 비교)
        if (!loginDto.getPassword().equals("password")) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }
        
        // 세션 토큰 생성 및 저장
        String sessionToken = UUID.randomUUID().toString();
        authPersistenceAdapter.insertUserSession(userDto.getUserId(), sessionToken, "New Chat");
        
        // JWT 토큰 생성 로직 필요 (임시로 세션 토큰 반환)
        return TokenInfo.builder()
                .grantType("Bearer")
                .accessToken(sessionToken)
                .expiresIn(3600L)
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
        
        // 비밀번호 암호화 (임시로 그대로 저장)
        String encodedPassword = registerDto.getPassword();
        
        // 사용자 정보 생성
        UserDto userDto = UserDto.builder()
                .username(registerDto.getUsername())
                .email(registerDto.getEmail())
                .passwordHash(encodedPassword)
                .displayName(registerDto.getDisplayName() != null ? registerDto.getDisplayName() : registerDto.getUsername())
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
    public UserDto getCurrentUser(String token) {
        // JWT 토큰에서 사용자 정보 추출 로직 필요
        Integer userId = extractUserIdFromToken(token);
        
        UserDto userDto = authPersistenceAdapter.selectUserById(userId);
        if (userDto != null) {
            // 비밀번호 정보는 반환하지 않음
            userDto.setPasswordHash(null);
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
     * JWT 토큰에서 사용자 ID 추출 (임시 구현).
     * 
     * @param token JWT 토큰
     * @return 사용자 ID
     */
    private Integer extractUserIdFromToken(String token) {
        // JWT 파싱 로직 필요
        return 1; // 임시 반환
    }
}
