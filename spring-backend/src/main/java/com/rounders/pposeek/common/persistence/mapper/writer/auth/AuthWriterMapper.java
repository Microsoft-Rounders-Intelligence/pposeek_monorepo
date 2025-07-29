/*****************************************************************
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.persistence.mapper.writer.auth;

import com.rounders.pposeek.common.annotation.WriterInterface;
import com.rounders.pposeek.common.model.domain.user.UserD;
import com.rounders.pposeek.common.model.domain.session.UserSessionD;

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

    /**
     * 사용자 등록.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param userD 사용자 도메인
     * @return 등록 처리한 갯수
     */
    public int insertUser(UserD userD);

    /**
     * 사용자 정보 수정.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param userD 사용자 도메인
     * @return 수정 처리한 갯수
     */
    public int updateUser(UserD userD);

    /**
     * 사용자 세션 생성.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param sessionD 세션 도메인
     * @return 등록 처리한 갯수
     */
    public int insertUserSession(UserSessionD sessionD);

    /**
     * 사용자 세션 활동 업데이트.
     * 
     * @author siunkimm@gmail.com
     * @since 2025
     * 
     * @param sessionToken 세션 토큰
     * @return 수정 처리한 갯수
     */
    public int updateSessionActivity(String sessionToken);
}
