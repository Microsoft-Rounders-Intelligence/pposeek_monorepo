package com.rounders.pposeek.common.model.dto.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * 공통 응답 메시지 DTO
 * 
 * @author siunkimm@gmail.com
 * @since 2025
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseMessage {
    
    private HttpStatus httpStatus;
    private String message;
    private Object data;
    private String errorCode;
    
    public static ResponseMessage success() {
        return ResponseMessage.builder()
                .httpStatus(HttpStatus.OK)
                .build();
    }
    
    public static ResponseMessage success(Object data) {
        return ResponseMessage.builder()
                .httpStatus(HttpStatus.OK)
                .data(data)
                .build();
    }
    
    public static ResponseMessage error(String message) {
        return ResponseMessage.builder()
                .httpStatus(HttpStatus.BAD_REQUEST)
                .message(message)
                .build();
    }
    
    public static ResponseMessage error(HttpStatus status, String message) {
        return ResponseMessage.builder()
                .httpStatus(status)
                .message(message)
                .build();
    }
}
