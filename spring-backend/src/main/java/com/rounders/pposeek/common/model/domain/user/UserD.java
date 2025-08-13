/*****************************************************************
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.model.domain.user;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

/**
 * 사용자 도메인 클래스.
 * 
 * @author siunkimm@gmail.com
 * @since 2025
 * 
 * @apiNote
 * 2025	siunkimm	최초 작성<br/>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserD {
    
    /**
     * 사용자 ID (Primary Key)
     */
    private Integer userId;
    
    /**
     * 이메일 (Unique)
     */
    private String email;
    
    /**
     * 비밀번호 해시
     */
    private String passwordHash;
    
    /**
     * 사용자 이름
     */
    private String name;
    
    /**
     * 생성일시
     */
    private LocalDateTime createdAt;
    
    /**
     * 마지막 로그인 일시
     */
    private LocalDateTime lastLogin;
}
