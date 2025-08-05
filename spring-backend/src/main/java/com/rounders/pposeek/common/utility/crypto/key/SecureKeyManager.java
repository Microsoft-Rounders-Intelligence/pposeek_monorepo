/*****************************************************************
 * 
 * PPoseek Web Application - Secure Key Manager
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.utility.crypto.key;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

/**
 * 암호화 키 통합 관리 클래스.
 * 
 * @author siunkimm@gmail.com
 * @since 2025
 * 
 * @apiNote
 * 2025	siunkimm	최초 작성<br/>
 */
@Slf4j
@Component
public class SecureKeyManager {

    /**
     * 개인정보 암호화 키 (ARIA-256용)
     */
    @Value("${app.encryption.personal-key:pposeek-personal-data-encryption-key-for-aria256-must-be-32-chars-minimum}")
    private String personalDataKey;

    /**
     * 이력서 암호화 키 (ARIA-256용)
     */
    @Value("${app.encryption.resume-key:pposeek-resume-data-encryption-key-for-aria256-must-be-32-chars-minimum}")
    private String resumeDataKey;

    /**
     * 비밀번호 해시용 Salt 키 (SHA-512용)
     */
    @Value("${app.encryption.salt-key:pposeek-password-salt-key-for-sha512-hashing-must-be-32-chars-minimum}")
    private String saltKey;

    /**
     * JWT 토큰 서명 키
     */
    @Value("${jwt.secret:pposeek-jwt-secret-key-for-token-signing-must-be-32-chars-minimum}")
    private String jwtSecret;

    /**
     * 개인정보 암호화 키 반환.
     * 
     * @return 개인정보 암호화 키
     */
    public String getPersonalDataKey() {
        if (personalDataKey.length() < 32) {
            log.warn("개인정보 암호화 키 길이가 32자 미만입니다. 보안상 위험할 수 있습니다.");
        }
        return personalDataKey;
    }

    /**
     * 이력서 암호화 키 반환.
     * 
     * @return 이력서 암호화 키
     */
    public String getResumeDataKey() {
        if (resumeDataKey.length() < 32) {
            log.warn("이력서 암호화 키 길이가 32자 미만입니다. 보안상 위험할 수 있습니다.");
        }
        return resumeDataKey;
    }

    /**
     * 비밀번호 Salt 키 반환.
     * 
     * @return Salt 키
     */
    public String getSaltKey() {
        if (saltKey.length() < 32) {
            log.warn("Salt 키 길이가 32자 미만입니다. 보안상 위험할 수 있습니다.");
        }
        return saltKey;
    }

    /**
     * JWT 서명 키 반환.
     * 
     * @return JWT 서명 키
     */
    public String getJwtSecret() {
        if (jwtSecret.length() < 32) {
            log.warn("JWT 서명 키 길이가 32자 미만입니다. 보안상 위험할 수 있습니다.");
        }
        return jwtSecret;
    }

    /**
     * 모든 키의 유효성을 검증.
     * 
     * @return 모든 키가 유효하면 true
     */
    public boolean validateAllKeys() {
        boolean isValid = true;
        
        if (personalDataKey.length() < 32) {
            log.error("개인정보 암호화 키가 유효하지 않습니다.");
            isValid = false;
        }
        
        if (resumeDataKey.length() < 32) {
            log.error("이력서 암호화 키가 유효하지 않습니다.");
            isValid = false;
        }
        
        if (saltKey.length() < 32) {
            log.error("Salt 키가 유효하지 않습니다.");
            isValid = false;
        }
        
        if (jwtSecret.length() < 32) {
            log.error("JWT 서명 키가 유효하지 않습니다.");
            isValid = false;
        }
        
        if (isValid) {
            log.info("모든 암호화 키가 유효합니다.");
        }
        
        return isValid;
    }
}
