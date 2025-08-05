/*****************************************************************
 * 
 * PPoseek Web Application - Custom Password Encoder
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.utility.crypto;

import java.security.NoSuchAlgorithmException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.rounders.pposeek.common.utility.crypto.key.SecureKeyManager;

import lombok.extern.slf4j.Slf4j;

/**
 * Spring Security에 사용할 Custom Password Encoder.
 * SHA-512 + Salt 방식을 사용합니다.
 * 
 * @author siunkimm@gmail.com
 * @since 2025
 * 
 * @apiNote
 * 2025	siunkimm	최초 작성<br/>
 */
@Slf4j
@Component
public class PPoseekPasswordEncoder implements PasswordEncoder {

    private final SecureKeyManager secureKeyManager;

    @Autowired
    public PPoseekPasswordEncoder(SecureKeyManager secureKeyManager) {
        this.secureKeyManager = secureKeyManager;
        // SHA-512 Cryptor에 키 매니저 설정
        Sha512Cryptor.setSecureKeyManager(secureKeyManager);
        // AES-256 Cryptor에 키 매니저 설정
        Aes256Cryptor.setSecureKeyManager(secureKeyManager);
    }

    @Override
    public String encode(CharSequence rawPassword) {
        try {
            return Sha512Cryptor.encode(rawPassword.toString());
        } catch (NoSuchAlgorithmException e) {
            log.error("비밀번호 암호화 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("비밀번호 암호화에 실패했습니다.", e);
        }
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        try {
            return Sha512Cryptor.matches(encodedPassword, rawPassword.toString());
        } catch (NoSuchAlgorithmException e) {
            log.error("비밀번호 검증 중 오류 발생: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * 비밀번호 강도 검증.
     * 
     * @param password 검증할 비밀번호
     * @return 유효하면 true
     */
    public boolean validatePasswordStrength(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }
        
        // 대소문자, 숫자, 특수문자 포함 검증
        boolean hasUpper = password.chars().anyMatch(Character::isUpperCase);
        boolean hasLower = password.chars().anyMatch(Character::isLowerCase);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        boolean hasSpecial = password.chars().anyMatch(ch -> !Character.isLetterOrDigit(ch));
        
        return hasUpper && hasLower && hasDigit && hasSpecial;
    }
}
