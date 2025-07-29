package com.rounders.pposeek.common.model.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 토큰 정보 DTO
 * 
 * @author siunkimm@gmail.com
 * @since 2025
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenInfo {
    
    private String grantType;
    private String accessToken;
    private String refreshToken;
    private Long expiresIn;
}
