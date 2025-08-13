/*****************************************************************
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.model.dto.user;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

/**
 * 사용자 정보 DTO 클래스.
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
public class UserDto {
    
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
     * 사용자 역할 (admin, user 등)
     * READ-ONLY: DB에서만 관리, 백엔드에서는 수정하지 않음
     */
    private String role;
    
    /**
     * 생성일시
     */
    private LocalDateTime createdAt;
    
    /**
     * 마지막 로그인 일시
     */
    private LocalDateTime lastLogin;
    
    // ========== Legacy fields for backward compatibility ==========
    /**
     * 사용자명 (email과 동일하게 처리)
     * @deprecated Use email instead
     */
    @Deprecated
    public String getUsername() {
        return this.email;
    }
    
    /**
     * 표시명 (name과 동일하게 처리)
     * @deprecated Use name instead
     */
    @Deprecated
    public String getDisplayName() {
        return this.name;
    }
}
