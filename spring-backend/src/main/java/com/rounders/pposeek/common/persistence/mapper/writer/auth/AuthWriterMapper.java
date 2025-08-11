/*****************************************************************
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.persistence.mapper.writer.auth;

import com.rounders.pposeek.common.annotation.WriterInterface;
import com.rounders.pposeek.common.model.dto.user.UserDto;
import com.rounders.pposeek.common.model.dto.auth.UserSessionDto;

/**
 * 인증 Writer 업무를 처리하는 데이터베이스 Mapper.
 * 
 * @author siunkimm@gmail.com
 * @since 2025
 * 
 * @apiNote
 * 2025	siunkimm	최초 작성<br/>
 */
@WriterInterface
public interface AuthWriterMapper {

    // ========== 사용자 관리 ==========

    /**
     * 사용자 등록.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param userDto 사용자 DTO
     * @return 등록 처리한 갯수
     */
    public int insertUser(UserDto userDto);

    /**
     * 사용자 정보 수정.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param userDto 사용자 DTO
     * @return 수정 처리한 갯수
     */
    public int updateUser(UserDto userDto);

    /**
     * 마지막 로그인 시간 업데이트.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param userId 사용자 ID
     * @return 수정 처리한 갯수
     */
    public int updateLastLogin(Integer userId);

    // ========== 세션 관리 ==========

    /**
     * 세션 생성.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param sessionDto 세션 DTO
     * @return 생성 처리한 갯수
     */
    public int createSession(UserSessionDto sessionDto);

    /**
     * 세션 활동 시간 업데이트.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param sessionToken 세션 토큰
     * @return 수정 처리한 갯수
     */
    public int updateSessionActivity(String sessionToken);

    /**
     * 세션 비활성화 (로그아웃).
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param sessionToken 세션 토큰
     * @return 수정 처리한 갯수
     */
    public int deactivateSession(String sessionToken);

    /**
     * 사용자의 모든 세션 비활성화.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param userId 사용자 ID
     * @return 수정 처리한 갯수
     */
    public int deactivateAllUserSessions(Integer userId);

    /**
     * 만료된 세션 정리 (24시간 이상 비활성).
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @return 삭제 처리한 갯수
     */
    public int cleanupExpiredSessions();
}
