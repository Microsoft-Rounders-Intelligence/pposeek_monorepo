package com.rounders.pposeek.test;

import com.rounders.pposeek.common.business.security.SecureKeyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * 애플리케이션 시작 시 Azure Key Vault 연동 테스트
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class KeyVaultStartupTest implements ApplicationRunner {

    private final SecureKeyService secureKeyService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        
        try {
            String jwtSecret = secureKeyService.getJwtSecret();
            String saltKey = secureKeyService.getPasswordSaltKey();
            String personalKey = secureKeyService.getPersonalDataKey();
            String resumeKey = secureKeyService.getResumeDataKey();
            String blobConnection = secureKeyService.getBlobConnectionString();
            
        } catch (Exception e) {
            System.out.println("Azure Key Vault 연동 테스트 실패: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
