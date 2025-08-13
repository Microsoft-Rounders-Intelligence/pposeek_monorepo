package com.rounders.pposeek.common.model.dto.auth;

import java.time.LocalDateTime;

/**
 * 사용자 세션 DTO
 * UserSession 도메인과 클라이언트 간 데이터 전송용
 */
public class UserSessionDto {
    
    private Long sessionId;
    private Integer userId;
    private String sessionToken;
    private String sessionName;
    private LocalDateTime createdAt;
    private LocalDateTime lastActivity;
    private Boolean isActive;
    
    // 기본 생성자
    public UserSessionDto() {}
    
    // 생성자
    public UserSessionDto(Integer userId, String sessionToken, String sessionName) {
        this.userId = userId;
        this.sessionToken = sessionToken;
        this.sessionName = sessionName;
        this.isActive = true;
    }
    
    // Getter & Setter
    public Long getSessionId() {
        return sessionId;
    }
    
    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }
    
    public Integer getUserId() {
        return userId;
    }
    
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    
    public String getSessionToken() {
        return sessionToken;
    }
    
    public void setSessionToken(String sessionToken) {
        this.sessionToken = sessionToken;
    }
    
    public String getSessionName() {
        return sessionName;
    }
    
    public void setSessionName(String sessionName) {
        this.sessionName = sessionName;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getLastActivity() {
        return lastActivity;
    }
    
    public void setLastActivity(LocalDateTime lastActivity) {
        this.lastActivity = lastActivity;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    @Override
    public String toString() {
        return "UserSessionDto{" +
                "sessionId=" + sessionId +
                ", userId=" + userId +
                ", sessionToken='" + sessionToken + '\'' +
                ", sessionName='" + sessionName + '\'' +
                ", createdAt=" + createdAt +
                ", lastActivity=" + lastActivity +
                ", isActive=" + isActive +
                '}';
    }
}
