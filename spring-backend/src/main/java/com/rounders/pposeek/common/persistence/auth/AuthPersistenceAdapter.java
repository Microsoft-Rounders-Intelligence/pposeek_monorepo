/*****************************************************************
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.persistence.auth;

import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import com.rounders.pposeek.common.model.dto.user.UserDto;
import com.rounders.pposeek.common.model.dto.auth.UserSessionDto;
import com.rounders.pposeek.common.persistence.mapper.reader.auth.AuthReaderMapper;
import com.rounders.pposeek.common.persistence.mapper.writer.auth.AuthWriterMapper;

import java.util.List;

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
@Slf4j
public class AuthPersistenceAdapter {

    /**
     * 인증 처리 Writer Mapper
     */
    private final AuthWriterMapper authWriterMapper;

    /**
     * 인증 처리 Reader Mapper
     */
    private final AuthReaderMapper authReaderMapper;

    // ========== 사용자 관리 ==========

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
        try {
            return authReaderMapper.selectUserForLogin(loginId);
        } catch (Exception e) {
            log.error("로그인용 사용자 조회 실패: {}", loginId, e);
            return null;
        }
    }

    /**
     * 이메일로 사용자 정보 조회.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param email 이메일
     * @return 사용자 정보
     */
    public UserDto selectUserByEmail(String email) {
        try {
            return authReaderMapper.selectUserByEmail(email);
        } catch (Exception e) {
            log.error("이메일로 사용자 조회 실패: {}", email, e);
            return null;
        }
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
        try {
            return authReaderMapper.checkUsernameDuplicate(username) > 0;
        } catch (Exception e) {
            log.error("사용자명 중복 확인 실패: {}", username, e);
            return true; // 에러 시 중복으로 처리
        }
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
        try {
            return authReaderMapper.checkEmailDuplicate(email) > 0;
        } catch (Exception e) {
            log.error("이메일 중복 확인 실패: {}", email, e);
            return true; // 에러 시 중복으로 처리
        }
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
        try {
            return authReaderMapper.selectUserById(userId);
        } catch (Exception e) {
            log.error("사용자 ID로 조회 실패: {}", userId, e);
            return null;
        }
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
        try {
            int result = authWriterMapper.insertUser(userDto);
            log.info("사용자 등록 완료: {} (ID: {})", userDto.getEmail(), userDto.getUserId());
            return result;
        } catch (Exception e) {
            log.error("사용자 등록 실패: {}", userDto.getEmail(), e);
            return 0;
        }
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
        try {
            int result = authWriterMapper.updateUser(userDto);
            log.info("사용자 정보 수정 완료: {}", userDto.getEmail());
            return result;
        } catch (Exception e) {
            log.error("사용자 정보 수정 실패: {}", userDto.getEmail(), e);
            return 0;
        }
    }

    /**
     * 마지막 로그인 시간 업데이트.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param userId 사용자 ID
     * @return 수정 처리한 갯수
     */
    public int updateLastLogin(Integer userId) {
        try {
            int result = authWriterMapper.updateLastLogin(userId);
            log.info("마지막 로그인 시간 업데이트 완료: {}", userId);
            return result;
        } catch (Exception e) {
            log.error("마지막 로그인 시간 업데이트 실패: {}", userId, e);
            return 0;
        }
    }

    // ========== 세션 관리 ==========

    /**
     * 세션 생성.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param sessionDto 세션 정보
     * @return 생성 처리한 갯수
     */
    public int createSession(UserSessionDto sessionDto) {
        try {
            int result = authWriterMapper.createSession(sessionDto);
            log.info("세션 생성 완료: {} (ID: {})", sessionDto.getSessionToken(), sessionDto.getSessionId());
            return result;
        } catch (Exception e) {
            log.error("세션 생성 실패: {}", sessionDto.getSessionToken(), e);
            return 0;
        }
    }

    /**
     * 세션 토큰으로 세션 조회.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param sessionToken 세션 토큰
     * @return 세션 정보
     */
    public UserSessionDto findSessionByToken(String sessionToken) {
        try {
            return authReaderMapper.findSessionByToken(sessionToken);
        } catch (Exception e) {
            log.error("세션 토큰으로 조회 실패: {}", sessionToken, e);
            return null;
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
    public List<UserSessionDto> findActiveSessionsByUserId(Integer userId) {
        try {
            return authReaderMapper.findActiveSessionsByUserId(userId);
        } catch (Exception e) {
            log.error("사용자 활성 세션 조회 실패: {}", userId, e);
            return null;
        }
    }

    /**
     * 세션 활동 시간 업데이트.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param sessionToken 세션 토큰
     * @return 수정 처리한 갯수
     */
    public int updateSessionActivity(String sessionToken) {
        try {
            int result = authWriterMapper.updateSessionActivity(sessionToken);
            log.debug("세션 활동 시간 업데이트: {}", sessionToken);
            return result;
        } catch (Exception e) {
            log.error("세션 활동 시간 업데이트 실패: {}", sessionToken, e);
            return 0;
        }
    }

    /**
     * 세션 비활성화 (로그아웃).
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param sessionToken 세션 토큰
     * @return 수정 처리한 갯수
     */
    public int deactivateSession(String sessionToken) {
        try {
            int result = authWriterMapper.deactivateSession(sessionToken);
            log.info("세션 비활성화 완료: {}", sessionToken);
            return result;
        } catch (Exception e) {
            log.error("세션 비활성화 실패: {}", sessionToken, e);
            return 0;
        }
    }

    /**
     * 사용자의 모든 세션 비활성화.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param userId 사용자 ID
     * @return 수정 처리한 갯수
     */
    public int deactivateAllUserSessions(Integer userId) {
        try {
            int result = authWriterMapper.deactivateAllUserSessions(userId);
            log.info("사용자 모든 세션 비활성화 완료: {} (비활성화된 세션 수: {})", userId, result);
            return result;
        } catch (Exception e) {
            log.error("사용자 모든 세션 비활성화 실패: {}", userId, e);
            return 0;
        }
    }

    /**
     * 세션 유효성 검증.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param sessionToken 세션 토큰
     * @return 유효한 세션 수 (0: 무효, 1: 유효)
     */
    public boolean validateSession(String sessionToken) {
        try {
            return authReaderMapper.validateSession(sessionToken) > 0;
        } catch (Exception e) {
            log.error("세션 유효성 검증 실패: {}", sessionToken, e);
            return false; // 에러 시 무효로 처리
        }
    }

    /**
     * 만료된 세션 정리.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @return 삭제 처리한 갯수
     */
    public int cleanupExpiredSessions() {
        try {
            int result = authWriterMapper.cleanupExpiredSessions();
            log.info("만료된 세션 정리 완료: {} 개 세션 삭제", result);
            return result;
        } catch (Exception e) {
            log.error("만료된 세션 정리 실패", e);
            return 0;
        }
    }
}
