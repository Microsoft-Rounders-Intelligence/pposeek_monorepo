/*****************************************************************
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.persistence.auth;

import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

import com.rounders.pposeek.common.model.dto.user.UserDto;
import com.rounders.pposeek.common.model.domain.user.UserD;
import com.rounders.pposeek.common.model.domain.session.UserSessionD;
import com.rounders.pposeek.common.persistence.mapper.reader.auth.AuthReaderMapper;
import com.rounders.pposeek.common.persistence.mapper.writer.auth.AuthWriterMapper;

/**
 * 인증 업무를 처리하는 데이터베이스 Adapter.
 * 
 * @author siunkimm@gmail.com
 * @since 2025
 * 
 * @apiNote
 * 2025	siunkimm	최초 작성<br/>
 */
@Repository
@RequiredArgsConstructor
public class AuthPersistenceAdapter {

    /**
     * 인증 처리 Writer Mapper
     */
    private final AuthWriterMapper authWriterMapper;

    /**
     * 인증 처리 Reader Mapper
     */
    private final AuthReaderMapper authReaderMapper;

    /**
     * 로그인용 사용자 정보 조회.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param loginId 사용자명 또는 이메일
     * @return 사용자 정보
     */
    public UserDto selectUserForLogin(String loginId) {
        return authReaderMapper.selectUserForLogin(loginId);
    }

    /**
     * 사용자명 중복 확인.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param username 사용자명
     * @return 중복 여부 (true: 중복, false: 중복 아님)
     */
    public boolean checkUsernameDuplicate(String username) {
        return authReaderMapper.checkUsernameDuplicate(username) > 0;
    }

    /**
     * 이메일 중복 확인.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param email 이메일
     * @return 중복 여부 (true: 중복, false: 중복 아님)
     */
    public boolean checkEmailDuplicate(String email) {
        return authReaderMapper.checkEmailDuplicate(email) > 0;
    }

    /**
     * 사용자 ID로 사용자 정보 조회.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param userId 사용자 ID
     * @return 사용자 정보
     */
    public UserDto selectUserById(Integer userId) {
        return authReaderMapper.selectUserById(userId);
    }

    /**
     * 사용자 등록.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param userDto 사용자 정보
     * @return 등록 처리한 갯수
     */
    public int insertUser(UserDto userDto) {
        UserD userD = UserD.builder()
                .username(userDto.getUsername())
                .email(userDto.getEmail())
                .passwordHash(userDto.getPasswordHash())
                .displayName(userDto.getDisplayName())
                .isActive(true)
                .build();

    
        int result = authWriterMapper.insertUser(userD);
        
      
        
        userDto.setUserId(userD.getUserId());

        // 3. 저장 결과를 반환합니다.
        return result;
    }

    /**
     * 사용자 정보 수정.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param userDto 사용자 정보
     * @return 수정 처리한 갯수
     */
    public int updateUser(UserDto userDto) {
        UserD userD = UserD.builder()
                .userId(userDto.getUserId())
                .email(userDto.getEmail())
                .displayName(userDto.getDisplayName())
                .build();

        return authWriterMapper.updateUser(userD);
    }

    /**
     * 사용자 세션 생성.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param userId 사용자 ID
     * @param sessionToken 세션 토큰
     * @param sessionName 세션명
     * @return 등록 처리한 갯수
     */
    public int insertUserSession(Integer userId, String sessionToken, String sessionName) {
        UserSessionD sessionD = UserSessionD.builder()
                .userId(userId)
                .sessionToken(sessionToken)
                .sessionName(sessionName)
                .isActive(true)
                .build();

        return authWriterMapper.insertUserSession(sessionD);
    }

    /**
     * 세션 활동 업데이트.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param sessionToken 세션 토큰
     * @return 수정 처리한 갯수
     */
    public int updateSessionActivity(String sessionToken) {
        return authWriterMapper.updateSessionActivity(sessionToken);
    }
}
