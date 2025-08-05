/*****************************************************************
 * 
 * PPoseek Web Application - AES-256 Cryptor (ARIA 대신 AES 사용)
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.utility.crypto;

import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Arrays;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.util.StringUtils;

import com.rounders.pposeek.common.utility.crypto.constant.EncryptionResultType;
import com.rounders.pposeek.common.utility.crypto.key.SecureKeyManager;

import lombok.extern.slf4j.Slf4j;

/**
 * AES-256-GCM (양방향) 암/복호화 (Hex String with UpperCase).
 * ARIA 대신 표준 AES-256을 사용하여 개인정보를 암호화합니다.
 * 
 * @author siunkimm@gmail.com
 * @since 2025
 * 
 * @apiNote
 * 2025	siunkimm	최초 작성<br/>
 */
@Slf4j
public final class Aes256Cryptor {

    public static final String ALGORITHM = "AES";
    public static final String TRANSFORMATION = "AES/GCM/NoPadding";
    public static final int AES_KEY_SIZE = 256;
    public static final int GCM_IV_LENGTH = 12; // GCM 모드용 IV 길이
    public static final int GCM_TAG_LENGTH = 16; // GCM 인증 태그 길이

    private static SecureKeyManager secureKeyManager;

    /**
     * Aes256Cryptor Constructor
     * <p>유틸리티 클래스는 생성자를 이용해 생성하는 것을 금지한다.</p>
     */
    private Aes256Cryptor() {
        throw new IllegalStateException("Utility Class");
    }

    /**
     * SecureKeyManager 설정.
     * 
     * @param keyManager SecureKeyManager 인스턴스
     */
    public static void setSecureKeyManager(SecureKeyManager keyManager) {
        secureKeyManager = keyManager;
    }

    /**
     * 평문 데이터를 암호화하여 16진수 대문자로 변환 (AES-256-GCM 방식).
     * 개인정보용 키를 사용합니다.
     * 
     * @param plainText 평문 데이터 문자열
     * @return 16진수 대문자로 변환된 암호 문자열
     */
    public static String encryptPersonalData(String plainText) {
        if (secureKeyManager == null) {
            log.warn("SecureKeyManager가 설정되지 않았습니다.");
            return null;
        }
        return encrypt(plainText, secureKeyManager.getPersonalDataKey(), EncryptionResultType.HEX_UPPER_CASE);
    }

    /**
     * 평문 데이터를 암호화하여 16진수 대문자로 변환 (AES-256-GCM 방식).
     * 이력서용 키를 사용합니다.
     * 
     * @param plainText 평문 데이터 문자열
     * @return 16진수 대문자로 변환된 암호 문자열
     */
    public static String encryptResumeData(String plainText) {
        if (secureKeyManager == null) {
            log.warn("SecureKeyManager가 설정되지 않았습니다.");
            return null;
        }
        return encrypt(plainText, secureKeyManager.getResumeDataKey(), EncryptionResultType.HEX_UPPER_CASE);
    }

    /**
     * 평문 데이터 암호화.
     * 
     * @param plainText 평문 데이터 문자열
     * @param encKey 암호화 키값
     * @param encodeType 암호화 결과값 인코딩 형식
     * @return 암호화 문자열
     */
    public static String encrypt(String plainText, String encKey, EncryptionResultType encodeType) {
        if (!StringUtils.hasLength(plainText) || !StringUtils.hasLength(encKey)) {
            return null;
        }

        try {
            // AES-256 키 생성
            SecretKey secretKey = generateSecretKey(encKey);
            
            // Cipher 초기화
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            
            // IV 생성
            byte[] iv = new byte[GCM_IV_LENGTH];
            new SecureRandom().nextBytes(iv);
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, iv);
            
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, gcmSpec);
            
            // 암호화 실행
            byte[] encryptedData = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));
            
            // IV + 암호화된 데이터 결합
            byte[] combined = new byte[iv.length + encryptedData.length];
            System.arraycopy(iv, 0, combined, 0, iv.length);
            System.arraycopy(encryptedData, 0, combined, iv.length, encryptedData.length);
            
            // 결과 인코딩
            String result = "";
            if (EncryptionResultType.BASE64.getValue() == encodeType.getValue()) {
                result = ArithmeticUtility.bytesToBase64String(combined);
            } else if (EncryptionResultType.HEX_LOWER_CASE.getValue() == encodeType.getValue()) {
                result = ArithmeticUtility.bytesToHexStringLowerCase(combined);
            } else {
                result = ArithmeticUtility.bytesToHexStringUpperCase(combined);
            }
            
            return result;
            
        } catch (Exception e) {
            log.error("암호화 중 오류 발생: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * 16진수 대문자로 암호화된 데이터를 평문 데이터로 변환.
     * 개인정보용 키를 사용합니다.
     * 
     * @param encryptedText 16진수 대문자 암호 문자열
     * @return 평문 데이터 문자열
     */
    public static String decryptPersonalData(String encryptedText) {
        if (secureKeyManager == null) {
            log.warn("SecureKeyManager가 설정되지 않았습니다.");
            return null;
        }
        return decrypt(encryptedText, secureKeyManager.getPersonalDataKey(), EncryptionResultType.HEX_UPPER_CASE);
    }

    /**
     * 16진수 대문자로 암호화된 데이터를 평문 데이터로 변환.
     * 이력서용 키를 사용합니다.
     * 
     * @param encryptedText 16진수 대문자 암호 문자열
     * @return 평문 데이터 문자열
     */
    public static String decryptResumeData(String encryptedText) {
        if (secureKeyManager == null) {
            log.warn("SecureKeyManager가 설정되지 않았습니다.");
            return null;
        }
        return decrypt(encryptedText, secureKeyManager.getResumeDataKey(), EncryptionResultType.HEX_UPPER_CASE);
    }

    /**
     * 암호화된 데이터를 평문 데이터로 변환.
     * 
     * @param encryptedText 암호 문자열
     * @param encKey 암호화 키값
     * @param encodeType 암호화 결과값 인코딩 형식
     * @return 평문 데이터 문자열
     */
    public static String decrypt(String encryptedText, String encKey, EncryptionResultType encodeType) {
        if (!StringUtils.hasLength(encryptedText) || !StringUtils.hasLength(encKey)) {
            return null;
        }

        try {
            // AES-256 키 생성
            SecretKey secretKey = generateSecretKey(encKey);
            
            // 데이터 디코딩
            byte[] combined = null;
            if (EncryptionResultType.BASE64.getValue() == encodeType.getValue()) {
                combined = ArithmeticUtility.base64StringToBytes(encryptedText);
            } else {
                combined = ArithmeticUtility.hexStringToBytes(encryptedText);
            }
            
            if (combined == null || combined.length < GCM_IV_LENGTH) {
                log.error("암호화된 데이터가 유효하지 않습니다.");
                return null;
            }
            
            // IV와 암호화된 데이터 분리
            byte[] iv = Arrays.copyOfRange(combined, 0, GCM_IV_LENGTH);
            byte[] encryptedData = Arrays.copyOfRange(combined, GCM_IV_LENGTH, combined.length);
            
            // Cipher 초기화
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, iv);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, gcmSpec);
            
            // 복호화 실행
            byte[] decryptedData = cipher.doFinal(encryptedData);
            
            return new String(decryptedData, StandardCharsets.UTF_8);
            
        } catch (Exception e) {
            log.error("복호화 중 오류 발생: {}", e.getMessage(), e);
            return null;
        }
    }

    /**
     * 문자열 키를 AES SecretKey로 변환.
     * 
     * @param keyString 키 문자열
     * @return SecretKey
     * @throws NoSuchAlgorithmException
     */
    private static SecretKey generateSecretKey(String keyString) throws NoSuchAlgorithmException {
        // 키를 32바이트(256비트)로 맞춤
        byte[] keyBytes = keyString.getBytes(StandardCharsets.UTF_8);
        byte[] key = new byte[32]; // 256 bits
        
        if (keyBytes.length >= 32) {
            System.arraycopy(keyBytes, 0, key, 0, 32);
        } else {
            System.arraycopy(keyBytes, 0, key, 0, keyBytes.length);
            // 부족한 부분은 0으로 패딩
        }
        
        return new SecretKeySpec(key, ALGORITHM);
    }
}
