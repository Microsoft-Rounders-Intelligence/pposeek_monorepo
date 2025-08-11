package com.rounders.pposeek.common.business.config;

import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Azure Key Vault 설정
 * 
 * JWT 시크릿, 암호화 키 등의 민감한 정보를 Azure Key Vault에서 관리
 */
@Configuration
@Slf4j
public class AzureKeyVaultConfig {

    @Value("${azure.keyvault.uri:}")
    private String keyVaultUri;

    @Bean
    public SecretClient secretClient() {
        if (keyVaultUri == null || keyVaultUri.isEmpty()) {
            log.warn("Azure Key Vault URI가 설정되지 않음. 환경변수 fallback 사용");
            return null;
        }

        try {
            return new SecretClientBuilder()
                    .vaultUrl(keyVaultUri)
                    .credential(new DefaultAzureCredentialBuilder().build())
                    .buildClient();
        } catch (Exception e) {
            log.error("Azure Key Vault 클라이언트 생성 실패: {}", e.getMessage());
            return null;
        }
    }
}
