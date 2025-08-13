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
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 회원가입 요청 DTO 클래스.
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
public class RegisterDto {
    /**
     * 사용자 ID
     */
    private Integer userId;
    
    /**
     * 사용자명 (선택사항)
     */
    @Size(min = 3, max = 50, message = "사용자명은 3-50자 사이여야 합니다")
    private String username;
    
    /**
     * 이메일
     */
    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    @Size(max = 100, message = "이메일은 100자 이하여야 합니다")
    private String email;
    
    /**
     * 비밀번호
     */
    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 6, max = 50, message = "비밀번호는 6-50자 사이여야 합니다")
    private String password;
    
    /**
     * 이름 (닉네임)
     */
    @NotBlank(message = "이름은 필수입니다")
    @Size(max = 100, message = "이름은 100자 이하여야 합니다")
    private String name;
    
    /**
     * 표시명
     */
    @Size(max = 100, message = "표시명은 100자 이하여야 합니다")
    private String displayName;
    
    /**
     * 전화번호
     */
    @Size(max = 20, message = "전화번호는 20자 이하여야 합니다")
    private String phone;

    /**
     * 암호화된 비밀번호 해시
     */
    private String passwordHash;
}
