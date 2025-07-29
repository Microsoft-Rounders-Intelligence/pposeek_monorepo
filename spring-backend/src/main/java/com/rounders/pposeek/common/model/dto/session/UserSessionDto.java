/*****************************************************************
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.model.dto.session;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

/**
 * 사용자 세션 정보 DTO 클래스.
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
public class UserSessionDto {
    
    /**
     * 세션 ID
     */
    private Integer sessionId;
    
    /**
     * 사용자 ID
     */
    private Integer userId;
    
    /**
     * 세션 토큰
     */
    private String sessionToken;
    
    /**
     * 세션명
     */
    private String sessionName;
    
    /**
     * 생성일시
     */
    private LocalDateTime createdAt;
    
    /**
     * 최종 활동 시간
     */
    private LocalDateTime lastActivity;
    
    /**
     * 활성화 상태
     */
    private Boolean isActive;
}
