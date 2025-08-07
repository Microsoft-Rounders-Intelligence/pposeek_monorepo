package com.rounders.pposeek.controller;

import com.rounders.pposeek.common.model.dto.kafka.ResumeAnalysisRequest;
import com.rounders.pposeek.common.business.kafka_ai.KafkaProducerService;
import com.rounders.pposeek.common.business.blob_storage.AzureBlobStorageService; // 새로 만든 서비스 임포트
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resume") // 상위 경로를 /api/resume으로 변경
@RequiredArgsConstructor
public class ResumeController {

    private final KafkaProducerService producerService;
    private final AzureBlobStorageService azureBlobStorageService; 

    @PostMapping("/upload") // 하위 경로를 /upload로 변경
    public ResponseEntity<String> analyzeResume(@RequestParam("file") MultipartFile file, @RequestParam("userId") String userId) {
        try {
            // 1. 파일을 블랍스토리지 스토리지에 업로드
            
            String fileUrl = azureBlobStorageService.upload(file, userId);

            // 2. Kafka에 분석 요청 메시지 전송
            ResumeAnalysisRequest request = new ResumeAnalysisRequest(userId, fileUrl);
            producerService.sendResumeAnalysisRequest(request);

            return ResponseEntity.ok("이력서 분석 요청이 접수되었습니다. 완료 시 알림이 전송됩니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("파일 업로드 또는 분석 요청에 실패했습니다.");
        }
    }
}