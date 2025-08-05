/*****************************************************************
 * 
 * PPoseek Web Application - Encryption System Test
 * 
 * Copyright(c) 2025 ROUNDERS. All rights reserved.
 * This software is the proprietary information of ROUNDERS.
 * 
 *****************************************************************/
package com.rounders.pposeek.common.utility.crypto;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import com.rounders.pposeek.common.utility.crypto.key.SecureKeyManager;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 암호화 시스템 통합 테스트.
 * 
 * @author siunkimm@gmail.com
 * @since 2025
 */
@SpringBootTest
@TestPropertySource(properties = {
    "app.encryption.personal-key=test-personal-data-encryption-key-32chars",
    "app.encryption.resume-key=test-resume-data-encryption-key-32chars-",
    "app.encryption.salt-key=test-password-salt-key-for-sha512-32chars",
    "jwt.secret=test-jwt-secret-key-for-token-signing-32chars"
})
class EncryptionSystemTest {

    private SecureKeyManager secureKeyManager;

    @BeforeEach
    void setUp() {
        secureKeyManager = new SecureKeyManager();
        
        // Cryptor 클래스들에 키 매니저 설정
        Sha512Cryptor.setSecureKeyManager(secureKeyManager);
        Aes256Cryptor.setSecureKeyManager(secureKeyManager);
    }

    @Test
    void testPasswordEncryption() throws Exception {
        // Given
        String password = "myPassword123!";
        
        // When
        String hashedPassword = Sha512Cryptor.encode(password);
        
        // Then
        assertNotNull(hashedPassword);
        assertNotEquals(password, hashedPassword);
        assertTrue(Sha512Cryptor.matches(hashedPassword, password));
        assertFalse(Sha512Cryptor.matches(hashedPassword, "wrongPassword"));
    }

    @Test
    void testPersonalDataEncryption() {
        // Given
        String email = "user@example.com";
        String phone = "010-1234-5678";
        
        // When
        String encryptedEmail = Aes256Cryptor.encryptPersonalData(email);
        String encryptedPhone = Aes256Cryptor.encryptPersonalData(phone);
        
        // Then
        assertNotNull(encryptedEmail);
        assertNotNull(encryptedPhone);
        assertNotEquals(email, encryptedEmail);
        assertNotEquals(phone, encryptedPhone);
        
        // 복호화 테스트
        String decryptedEmail = Aes256Cryptor.decryptPersonalData(encryptedEmail);
        String decryptedPhone = Aes256Cryptor.decryptPersonalData(encryptedPhone);
        
        assertEquals(email, decryptedEmail);
        assertEquals(phone, decryptedPhone);
    }

    @Test
    void testResumeDataEncryption() {
        // Given
        String resumeContent = "이력서 내용입니다. 개인정보가 포함되어 있습니다.";
        
        // When
        String encryptedResume = Aes256Cryptor.encryptResumeData(resumeContent);
        
        // Then
        assertNotNull(encryptedResume);
        assertNotEquals(resumeContent, encryptedResume);
        
        // 복호화 테스트
        String decryptedResume = Aes256Cryptor.decryptResumeData(encryptedResume);
        assertEquals(resumeContent, decryptedResume);
    }

    @Test
    void testArithmeticUtility() {
        // Given
        String testString = "Hello World!";
        byte[] testBytes = testString.getBytes();
        
        // Base64 테스트
        String base64 = ArithmeticUtility.bytesToBase64String(testBytes);
        byte[] decodedBytes = ArithmeticUtility.base64StringToBytes(base64);
        assertEquals(testString, new String(decodedBytes));
        
        // Hex 테스트
        String hexUpper = ArithmeticUtility.bytesToHexStringUpperCase(testBytes);
        String hexLower = ArithmeticUtility.bytesToHexStringLowerCase(testBytes);
        byte[] hexBytes = ArithmeticUtility.hexStringToBytes(hexUpper);
        assertEquals(testString, new String(hexBytes));
        
        assertNotEquals(hexUpper, hexLower);
        assertEquals(hexUpper.toLowerCase(), hexLower);
    }

    @Test
    void testNullAndEmptyInputs() {
        // 빈 문자열/null 입력 테스트
        assertNull(Aes256Cryptor.encryptPersonalData(null));
        assertNull(Aes256Cryptor.encryptPersonalData(""));
        assertNull(Aes256Cryptor.decryptPersonalData(null));
        assertNull(Aes256Cryptor.decryptPersonalData(""));
        
        assertNull(ArithmeticUtility.bytesToBase64String(null));
        assertNull(ArithmeticUtility.base64StringToBytes(null));
        assertNull(ArithmeticUtility.hexStringToBytes(null));
    }
}
