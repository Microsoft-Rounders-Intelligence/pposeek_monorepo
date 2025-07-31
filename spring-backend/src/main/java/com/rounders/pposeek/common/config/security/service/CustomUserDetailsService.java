/*****************************************************************
 * 
 * PPoseek Web Application - Custom User Details Service
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.config.security.service;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.rounders.pposeek.common.model.dto.user.UserDto;
import com.rounders.pposeek.common.persistence.auth.AuthPersistenceAdapter;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * Spring Security UserDetailsService 구현체.
 * 사용자 인증 시 사용자 정보와 권한을 로드
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
public class CustomUserDetailsService implements UserDetailsService {

    private final AuthPersistenceAdapter authPersistenceAdapter;

  
    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        log.debug("사용자 정보 로드 시도: {}", usernameOrEmail);

        UserDto user;

        //  이메일 형식인지, ID 형식인지 판별하여 조회하는 로직으로 변경
        if (usernameOrEmail.contains("@")) {
            // 이메일로 사용자 조회
            user = authPersistenceAdapter.selectUserByEmail(usernameOrEmail);
            if (user == null) {
                log.warn("이메일을 찾을 수 없음: {}", usernameOrEmail);
                throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + usernameOrEmail);
            }
        } else {
            // 숫자 ID로 사용자 조회
            try {
                Integer userId = Integer.parseInt(usernameOrEmail);
                user = authPersistenceAdapter.selectUserById(userId);
                if (user == null) {
                    log.warn("사용자 ID를 찾을 수 없음: {}", userId);
                    throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + userId);
                }
            } catch (NumberFormatException e) {
                log.error("잘못된 사용자 ID 형식: {}", usernameOrEmail);
                throw new UsernameNotFoundException("잘못된 사용자 ID 형식: " + usernameOrEmail);
            }
        }
        
        log.debug("사용자 정보 로드 완료: {} ({})", user.getUsername(), user.getRole());
        
        return User.builder()
                .username(String.valueOf(user.getUserId())) // username 필드에는 항상 고유 식별자인 '사용자 ID'를 사용
                .password(user.getPasswordHash() != null ? user.getPasswordHash() : "")
                .authorities(getAuthorities(user.getRole()))
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
        
    }

    /**
     * 사용자 역할에 따른 권한 설정.
     * 
     * @param role 사용자 역할
     * @return 권한 목록
     */
    private Collection<? extends GrantedAuthority> getAuthorities(String role) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        
        if (role != null) {
            // ROLE_ 접두사 추가 (Spring Security 규칙)
            String roleWithPrefix = role.startsWith("ROLE_") ? role : "ROLE_" + role.toUpperCase();
            authorities.add(new SimpleGrantedAuthority(roleWithPrefix));
            
            log.debug("사용자 권한 설정: {}", roleWithPrefix);
            
            // 역할별 추가 권한 설정
            switch (role.toUpperCase()) {
                case "ADMIN":
                    authorities.add(new SimpleGrantedAuthority("ROLE_USER")); // 관리자는 일반 사용자 권한도 포함
                    authorities.add(new SimpleGrantedAuthority("PERMISSION_VIEW_ANALYTICS"));
                    authorities.add(new SimpleGrantedAuthority("PERMISSION_MANAGE_USERS"));
                    break;
                case "COMPANY":
                    authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                    authorities.add(new SimpleGrantedAuthority("PERMISSION_POST_JOBS"));
                    authorities.add(new SimpleGrantedAuthority("PERMISSION_VIEW_APPLICATIONS"));
                    break;
                case "USER":
                default:
                    authorities.add(new SimpleGrantedAuthority("PERMISSION_APPLY_JOBS"));
                    authorities.add(new SimpleGrantedAuthority("PERMISSION_VIEW_PROFILE"));
                    break;
            }
        } else {
            // 기본 권한
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }
        
        return authorities;
    }
}
