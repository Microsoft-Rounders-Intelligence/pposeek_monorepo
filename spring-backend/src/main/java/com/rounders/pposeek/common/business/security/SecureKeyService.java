package com.rounders.pposeek.common.business.security;

import com.azure.security.keyvault.secrets.SecretClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * 보안 키 관리 서비스
 * 
 * Azure Key Vault 또는 환경변수에서 JWT, 암호화 키들을 안전하게 가져옴
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SecureKeyService {

    private final SecretClient secretClient;

    // 환경변수 fallback 값들
    @Value("${jwt.secret:pposeek-jwt-secret-key-for-token-signing-must-be-32-chars-minimum}")
    private String fallbackJwtSecret;

    @Value("${app.encryption.salt-key:pposeek-password-salt-key-for-sha512-hashing-must-be-32-chars-minimum}")
    private String fallbackSaltKey;

    @Value("${azure.blob.connection-string:}")
    private String fallbackBlobConnectionString;

    @Value("${app.encryption.personal-key:pposeek-personal-data-encryption-key-for-aria256-must-be-32-chars-minimum}")
    private String fallbackPersonalDataKey;

    @Value("${app.encryption.resume-key:pposeek-resume-data-encryption-key-for-aria256-must-be-32-chars-minimum}")
    private String fallbackResumeDataKey;

    /**
     * JWT 시크릿 키 가져오기
     */
    public String getJwtSecret() {
        return getSecret("jwt-secret", fallbackJwtSecret);
    }

    /**
     * 패스워드 솔트 키 가져오기 (SHA512용)
     */
    public String getPasswordSaltKey() {
        return getSecret("password-salt-key", fallbackSaltKey);
    }

    /**
     * 개인정보 암호화 키 가져오기 (ARIA256용)
     */
    public String getPersonalDataKey() {
        return getSecret("personal-data-key", fallbackPersonalDataKey);
    }

    /**
     * 이력서 암호화 키 가져오기 (ARIA256용)
     */
    public String getResumeDataKey() {
        return getSecret("resume-data-key", fallbackResumeDataKey);
    }

    /**
     * Azure Blob Storage 연결 문자열 가져오기
     */
    public String getBlobConnectionString() {
        return getSecret("azure-blob-connection-string", fallbackBlobConnectionString);
    }

    /**
     * Key Vault 또는 환경변수에서 시크릿 가져오기
     */
    private String getSecret(String secretName, String fallbackValue) {
        try {
            if (secretClient != null) {
                log.info("Key Vault에서 시크릿 조회 시도: {}", secretName);
                String secret = secretClient.getSecret(secretName).getValue();
                if (secret != null && !secret.isEmpty()) {
                    log.info("Key Vault에서 시크릿 조회 성공: {} (길이: {})", secretName, secret.length());
                    return secret;
                } else {
                    log.warn("Key Vault에서 시크릿이 비어있음: {}", secretName);
                }
            } else {
                log.warn("Key Vault 클라이언트가 null입니다. 환경변수 fallback 사용");
            }
        } catch (Exception e) {
            log.error("Key Vault에서 시크릿 조회 실패: {} - {}", secretName, e.getMessage());
        }

        // Key Vault 실패시 환경변수 fallback
        log.info("환경변수 fallback 사용: {} (길이: {})", secretName, fallbackValue.length());
        return fallbackValue;
    }
}
