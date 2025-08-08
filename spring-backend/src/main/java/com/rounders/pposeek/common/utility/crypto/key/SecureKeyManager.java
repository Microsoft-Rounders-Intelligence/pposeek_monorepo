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

import com.rounders.pposeek.common.business.security.SecureKeyService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * 암호화 키 통합 관리 클래스.
 * Azure Key Vault 또는 환경변수에서 키를 가져와 관리
 * 
 * @author siunkimm@gmail.com
 * @since 2025
 * 
 * @apiNote
 * 2025	siunkimm	최초 작성<br/>
 * 2025	siunkimm	Azure Key Vault 연동 추가<br/>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SecureKeyManager {

    private final SecureKeyService secureKeyService;

    /**
     * 개인정보 암호화 키 (ARIA-256용) - 환경변수 fallback
     */
    @Value("${app.encryption.personal-key:pposeek-personal-data-encryption-key-for-aria256-must-be-32-chars-minimum}")
    private String personalDataKeyFallback;

    /**
     * 이력서 암호화 키 (ARIA-256용) - 환경변수 fallback
     */
    @Value("${app.encryption.resume-key:pposeek-resume-data-encryption-key-for-aria256-must-be-32-chars-minimum}")
    private String resumeDataKeyFallback;

    /**
     * 개인정보 암호화 키 반환 (Azure Key Vault 사용).
     * 
     * @return 개인정보 암호화 키 (ARIA256용)
     */
    public String getPersonalDataKey() {
        String key = secureKeyService.getPersonalDataKey();
        if (key.length() < 32) {
            log.warn("개인정보 암호화 키 길이가 32자 미만입니다. 보안상 위험할 수 있습니다.");
        }
        return key;
    }

    /**
     * 이력서 암호화 키 반환 (Azure Key Vault 사용).
     * 
     * @return 이력서 암호화 키 (ARIA256용)
     */
    public String getResumeDataKey() {
        String key = secureKeyService.getResumeDataKey();
        if (key.length() < 32) {
            log.warn("이력서 암호화 키 길이가 32자 미만입니다. 보안상 위험할 수 있습니다.");
        }
        return key;
    }

    /**
     * 비밀번호 Salt 키 반환 (Azure Key Vault 사용).
     * 
     * @return Salt 키
     */
    public String getSaltKey() {
        String saltKey = secureKeyService.getPasswordSaltKey();
        if (saltKey.length() < 32) {
            log.warn("Salt 키 길이가 32자 미만입니다. 보안상 위험할 수 있습니다.");
        }
        return saltKey;
    }

    /**
     * JWT 서명 키 반환 (Azure Key Vault 사용).
     * 
     * @return JWT 서명 키
     */
    public String getJwtSecret() {
        String jwtSecret = secureKeyService.getJwtSecret();
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
        
        String personalKey = getPersonalDataKey();
        if (personalKey.length() < 32) {
            log.error("개인정보 암호화 키가 유효하지 않습니다.");
            isValid = false;
        }
        
        String resumeKey = getResumeDataKey();
        if (resumeKey.length() < 32) {
            log.error("이력서 암호화 키가 유효하지 않습니다.");
            isValid = false;
        }
        
        String saltKey = getSaltKey();
        if (saltKey.length() < 32) {
            log.error("Salt 키가 유효하지 않습니다.");
            isValid = false;
        }
        
        String jwtSecret = getJwtSecret();
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
