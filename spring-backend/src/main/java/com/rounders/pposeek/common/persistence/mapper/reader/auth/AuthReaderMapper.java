/*****************************************************************
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.persistence.mapper.reader.auth;

import com.rounders.pposeek.common.annotation.ReaderInterface;
import com.rounders.pposeek.common.model.dto.user.UserDto;
import com.rounders.pposeek.common.model.dto.auth.UserSessionDto;
import java.util.List;

/**
 * 인증 Reader 업무를 처리하는 데이터베이스 Mapper.
 * 
 * @author siunkimm@gmail.com
 * @since 2025
 * 
 * @apiNote
 * 2025	siunkimm	최초 작성<br/>
 */
@ReaderInterface
public interface AuthReaderMapper {

    // ========== 사용자 조회 ==========

    /**
     * 로그인용 사용자 정보 조회 (사용자명 또는 이메일로).
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param loginId 사용자명 또는 이메일
     * @return 사용자 정보
     */
    public UserDto selectUserForLogin(String loginId);
    
    /**
     * 이메일로 사용자 정보 조회.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param email 이메일
     * @return 사용자 정보
     */
    public UserDto selectUserByEmail(String email);

    /**
     * 사용자명 존재 여부 확인.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param username 사용자명
     * @return 존재 여부 (0: 없음, 1 이상: 있음)
     */
    public int checkUsernameDuplicate(String username);

    /**
     * 이메일 존재 여부 확인.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param email 이메일
     * @return 존재 여부 (0: 없음, 1 이상: 있음)
     */
    public int checkEmailDuplicate(String email);

    /**
     * 사용자 ID로 사용자 정보 조회.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param userId 사용자 ID
     * @return 사용자 정보
     */
    public UserDto selectUserById(Integer userId);

    // ========== 세션 조회 ==========

    /**
     * 세션 토큰으로 세션 조회.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param sessionToken 세션 토큰
     * @return 세션 정보
     */
    public UserSessionDto findSessionByToken(String sessionToken);

    /**
     * 사용자의 활성 세션 목록 조회.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param userId 사용자 ID
     * @return 활성 세션 목록
     */
    public List<UserSessionDto> findActiveSessionsByUserId(Integer userId);

    /**
     * 세션 유효성 검증.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param sessionToken 세션 토큰
     * @return 유효한 세션 수 (0: 무효, 1: 유효)
     */
    public int validateSession(String sessionToken);
}
