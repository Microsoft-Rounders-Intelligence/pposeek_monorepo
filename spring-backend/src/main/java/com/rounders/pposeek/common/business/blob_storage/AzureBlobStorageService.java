package com.rounders.pposeek.common.business.blob_storage;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class AzureBlobStorageService {

    private final BlobContainerClient containerClient;

    public AzureBlobStorageService(
            @Value("${azure.blob.connection-string}") String connectionString,
            @Value("${azure.blob.container-name}") String containerName) {
        
        BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
                .connectionString(connectionString)
                .buildClient();
        
        this.containerClient = blobServiceClient.getBlobContainerClient(containerName);
        if (!containerClient.exists()) {
            containerClient.create();
        }
    }

    /**
     * 파일을 Azure Blob Storage에 업로드하고 해당 URL을 반환합니다.
     * @param file 업로드할 MultipartFile
     * @param userId 사용자 ID
     * @return 업로드된 파일의 URL
     * @throws IOException 파일 처리 중 오류 발생 시
     */
    public String upload(MultipartFile file, String userId) throws IOException {
        // ⭐ [수정됨] 파일명을 'user_{userId}_{원본파일이름}' 형식으로 변경합니다.
        String blobFilename = String.format("user_%s_%s", userId, file.getOriginalFilename());

        // BlobClient를 가져옵니다.
        BlobClient blobClient = containerClient.getBlobClient(blobFilename);

        // 파일을 업로드합니다.
        blobClient.upload(file.getInputStream(), file.getSize(), true); // true는 덮어쓰기 허용

        // 업로드된 파일의 URL을 반환합니다.
        return blobClient.getBlobUrl();
    }
}
