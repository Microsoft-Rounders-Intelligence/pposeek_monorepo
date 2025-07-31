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
     * 사용자 ID
     */
    private Integer userId;
    
    /**
     * 사용자명
     */
    private String username;
    
    /**
     * 이메일
     */
    private String email;
    
    /**
     * 비밀번호 해시
     */
    private String passwordHash;
    
    /**
     * 표시명
     */
    private String displayName;
    
    /**
     * 사용자 역할 (USER, COMPANY, ADMIN)
     */
    private String role;
    
    /**
     * 생성일시
     */
    private LocalDateTime createdAt;
    
    /**
     * 수정일시
     */
    private LocalDateTime updatedAt;
    
    /**
     * 활성화 상태
     */
    private Boolean isActive;
}
