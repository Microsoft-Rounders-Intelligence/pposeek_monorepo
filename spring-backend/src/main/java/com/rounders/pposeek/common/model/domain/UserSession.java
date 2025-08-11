package com.rounders.pposeek.common.model.domain;

import java.time.LocalDateTime;

/**
 * 사용자 세션 도메인 모델
 * MySQL UserSessions 테이블과 매핑되는 엔티티
 */
public class UserSession {
    
    private Long sessionId;           // 세션 ID (자동 증가)
    private Integer userId;           // 사용자 ID (User 테이블 참조)
    private String sessionToken;     // 세션 토큰 (JWT 등)
    private String sessionName;      // 세션 이름
    private LocalDateTime createdAt; // 세션 생성 시간
    private LocalDateTime lastActivity; // 마지막 활동 시간
    private Boolean isActive;        // 세션 활성화 상태
    
    // 기본 생성자
    public UserSession() {}
    
    // 생성자
    public UserSession(Integer userId, String sessionToken, String sessionName) {
        this.userId = userId;
        this.sessionToken = sessionToken;
        this.sessionName = sessionName != null ? sessionName : "Default Session";
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
        return "UserSession{" +
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
