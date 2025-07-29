/*****************************************************************
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.model.dto.auth;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import jakarta.validation.constraints.NotBlank;

/**
 * 로그인 요청 DTO 클래스.
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
public class LoginDto {
    
    /**
     * 사용자명 또는 이메일
     */
    @NotBlank(message = "사용자명 또는 이메일은 필수입니다")
    private String username;
    
    /**
     * 비밀번호
     */
    @NotBlank(message = "비밀번호는 필수입니다")
    private String password;
}
