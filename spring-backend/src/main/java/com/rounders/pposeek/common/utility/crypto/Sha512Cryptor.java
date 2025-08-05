/*****************************************************************
 * 
 * PPoseek Web Application - SHA-512 Cryptor
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.utility.crypto;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

import org.springframework.util.StringUtils;

import com.rounders.pposeek.common.utility.crypto.constant.EncryptionResultType;
import com.rounders.pposeek.common.utility.crypto.constant.SaltMethod;
import com.rounders.pposeek.common.utility.crypto.key.SecureKeyManager;

import lombok.extern.slf4j.Slf4j;

/**
 * SHA-512 (단방향) 암호화 (with Salt & Hex String with UpperCase).
 * 
 * @author siunkimm@gmail.com
 * @since 2025
 * 
 * @apiNote
 * 2025	siunkimm	최초 작성<br/>
 */
@Slf4j
public final class Sha512Cryptor {

    public static final String ALGORITHM = "SHA-512";
    public static final int SALT_SIZE = 32;

    private static SecureKeyManager secureKeyManager;

    /**
     * Sha512Cryptor Constructor
     * <p>유틸리티 클래스는 생성자를 이용해 생성하는 것을 금지한다.</p>
     */
    private Sha512Cryptor() {
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
     * SHA-512 암호화 처리.
     * <p>
     * 가급적 이 암호화 기능만 사용할 것을 권고한다.<br/>
     * SaltMethod.PPOSEEK &amp; EncryptionResultType.HEX_UPPER_CASE (default)
     * </p>
     * 
     * @param plainText 평문 데이터
     * @return 암호화된 문자열
     * @throws NoSuchAlgorithmException
     */
    public static String encode(String plainText) throws NoSuchAlgorithmException {
        return encode(plainText, getSalt(SaltMethod.PPOSEEK), EncryptionResultType.HEX_UPPER_CASE);
    }

    /**
     * SALT 값을 지정하는 SHA-512 암호화 처리.
     * 
     * @param plainText 평문 데이터
     * @param salt SALT 값
     * @param encodeType 암호화 결과값 인코딩 형식
     * @return 암호화된 문자열
     * @throws NoSuchAlgorithmException
     */
    public static String encode(String plainText, byte[] salt, EncryptionResultType encodeType)
            throws NoSuchAlgorithmException {
        if (!StringUtils.hasLength(plainText) && (null == salt)) {
            return null;
        }

        MessageDigest messageDigest = MessageDigest.getInstance(ALGORITHM);

        messageDigest.reset();
        messageDigest.update(plainText.getBytes(StandardCharsets.UTF_8));

        if (null != salt) {
            messageDigest.update(salt);
        }

        byte[] hashedData = messageDigest.digest();
        String result = "";

        if (EncryptionResultType.BASE64.getValue() == encodeType.getValue()) {
            result = ArithmeticUtility.bytesToBase64String(hashedData);
        } else if (EncryptionResultType.HEX_LOWER_CASE.getValue() == encodeType.getValue()) {
            result = ArithmeticUtility.bytesToHexStringLowerCase(hashedData);
        } else if (EncryptionResultType.HEX_UPPER_CASE.getValue() == encodeType.getValue()) {
            result = ArithmeticUtility.bytesToHexStringUpperCase(hashedData);
        } else {
            result = ArithmeticUtility.bytesToHexStringUpperCase(hashedData);
        }

        return result;
    }

    /**
     * SaltMethod를 사용한 SHA-512 암호화 처리.
     * 
     * @param plainText 평문 데이터
     * @param saltMethod SALT 생성 구분
     * @param encodeType 암호화 결과값 인코딩 형식
     * @return 암호화된 문자열
     * @throws NoSuchAlgorithmException
     */
    public static String encode(String plainText, SaltMethod saltMethod, EncryptionResultType encodeType)
            throws NoSuchAlgorithmException {
        return encode(plainText, getSalt(saltMethod), encodeType);
    }

    /**
     * SaltMethod를 사용한 SHA-512 암호화 처리.
     * 
     * @param plainText 평문 데이터
     * @param saltMethod SALT 생성 구분
     * @return 암호화된 문자열
     * @throws NoSuchAlgorithmException
     */
    public static String encode(String plainText, SaltMethod saltMethod) throws NoSuchAlgorithmException {
        return encode(plainText, getSalt(saltMethod), EncryptionResultType.HEX_UPPER_CASE);
    }

    /**
     * 해시작업에 필요한 Salt 값을 구한다.
     * 
     * @param saltMethod Salt 생성 방식
     * @return Salt 값
     */
    public static byte[] getSalt(SaltMethod saltMethod) {
        if (SaltMethod.PPOSEEK.equals(saltMethod)) {
            return generatePposeekSalt();
        } else if (SaltMethod.RANDOM.equals(saltMethod)) {
            return generateRandomSalt();
        }

        return new byte[0];
    }

    /**
     * PPoseek 고정 Salt 값 생성.
     * 
     * @return Salt 값
     */
    public static byte[] generatePposeekSalt() {
        if (null == secureKeyManager) {
            log.warn("SecureKeyManager가 설정되지 않았습니다. 기본 Salt를 사용합니다.");
            return "pposeek-default-salt-key".getBytes(StandardCharsets.UTF_8);
        }

        return secureKeyManager.getSaltKey().getBytes(StandardCharsets.UTF_8);
    }

    /**
     * Random Salt 값 생성.
     * 
     * @return Salt 값
     */
    public static byte[] generateRandomSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[SALT_SIZE];
        random.nextBytes(salt);
        return salt;
    }

    /**
     * 기존 암호화된 값과 입력한 평문을 암호화한 값이 일치하는지 검사.
     * 
     * @param hashedData 기 암호화 값
     * @param plainText 입력한 평문
     * @param salt SALT 값
     * @param encodeType 암호화 결과값 인코딩 형식
     * @return 일치 여부
     * @throws NoSuchAlgorithmException
     */
    public static boolean matches(String hashedData, String plainText, byte[] salt, EncryptionResultType encodeType)
            throws NoSuchAlgorithmException {
        if (!StringUtils.hasLength(hashedData)
                || (!StringUtils.hasLength(plainText) && (null == salt))) {
            return false;
        }

        String newHashedData = encode(plainText, salt, encodeType);
        return hashedData.equals(newHashedData);
    }

    /**
     * 기존 암호화된 값과 입력한 평문을 암호화한 값이 일치하는지 검사.
     * <p>
     * 가급적 이 검사 기능만 사용할 것을 권고한다.<br/>
     * SaltMethod.PPOSEEK &amp; EncryptionResultType.HEX_UPPER_CASE (default)
     * </p>
     * 
     * @param hashedData 기 암호화 값
     * @param plainText 입력한 평문
     * @return 일치 여부
     * @throws NoSuchAlgorithmException
     */
    public static boolean matches(String hashedData, String plainText) throws NoSuchAlgorithmException {
        return matches(hashedData, plainText, getSalt(SaltMethod.PPOSEEK), EncryptionResultType.HEX_UPPER_CASE);
    }
}
