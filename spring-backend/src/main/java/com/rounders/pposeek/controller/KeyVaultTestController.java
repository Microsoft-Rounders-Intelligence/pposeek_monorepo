package com.rounders.pposeek.controller;

import com.rounders.pposeek.common.business.security.SecureKeyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Azure Key Vault 연동 테스트 컨트롤러
 */
@RestController
@RequestMapping("/api/test/vault")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Azure Key Vault", description = "Key Vault 연동 테스트 API")
public class KeyVaultTestController {

    private final SecureKeyService secureKeyService;

    @GetMapping("/test")
    @Operation(summary = "Key Vault 연결 테스트", description = "Azure Key Vault에서 모든 보안 키들을 가져올 수 있는지 테스트")
    public ResponseEntity<Map<String, Object>> testKeyVault() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 모든 키들 확인 (실제 값은 로그에만 출력)
            String jwtSecret = secureKeyService.getJwtSecret();
            String saltKey = secureKeyService.getPasswordSaltKey();
            String personalKey = secureKeyService.getPersonalDataKey();
            String resumeKey = secureKeyService.getResumeDataKey();
            String blobConnection = secureKeyService.getBlobConnectionString();
            
            // 유효성 검사
            boolean jwtValid = jwtSecret != null && jwtSecret.length() >= 32;
            boolean saltValid = saltKey != null && saltKey.length() >= 32;
            boolean personalValid = personalKey != null && personalKey.length() >= 32;
            boolean resumeValid = resumeKey != null && resumeKey.length() >= 32;
            boolean blobValid = blobConnection != null && !blobConnection.isEmpty();
            
            log.info("Key Vault 테스트 결과:");
            log.info("- JWT Secret 길이: {} (유효: {})", jwtSecret.length(), jwtValid);
            log.info("- Salt Key 길이: {} (유효: {})", saltKey.length(), saltValid);
            log.info("- Personal Data Key 길이: {} (유효: {})", personalKey.length(), personalValid);
            log.info("- Resume Data Key 길이: {} (유효: {})", resumeKey.length(), resumeValid);
            log.info("- Blob Connection String 유효: {}", blobValid);
            
            response.put("status", "success");
            response.put("keys", Map.of(
                "jwt_secret", Map.of("valid", jwtValid, "length", jwtSecret.length()),
                "salt_key", Map.of("valid", saltValid, "length", saltKey.length()),
                "personal_data_key", Map.of("valid", personalValid, "length", personalKey.length()),
                "resume_data_key", Map.of("valid", resumeValid, "length", resumeKey.length()),
                "blob_connection", Map.of("valid", blobValid)
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Key Vault 테스트 실패: {}", e.getMessage());
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
