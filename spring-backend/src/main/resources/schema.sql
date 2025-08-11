-- MySQL 스키마 정의
-- PPoseek 애플리케이션용 데이터베이스 스키마

-- 사용자 테이블 (제공된 MySQL 스키마 기준)
CREATE TABLE IF NOT EXISTS `User` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'user' COMMENT '사용자 역할 (admin, user 등)',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_user_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 사용자 세션 테이블 (제공된 MySQL 스키마 기준)
CREATE TABLE IF NOT EXISTS `UserSessions` (
  `session_id` bigint NOT NULL AUTO_INCREMENT COMMENT '세션 ID (자동 증가)',
  `user_id` int NOT NULL COMMENT '사용자 ID (User 테이블 참조)',
  `session_token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '세션 토큰 (JWT 등)',
  `session_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'Default Session' COMMENT '세션 이름',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '세션 생성 시간',
  `last_activity` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '마지막 활동 시간',
  `is_active` tinyint(1) DEFAULT '1' COMMENT '세션 활성화 상태',
  PRIMARY KEY (`session_id`),
  UNIQUE KEY `session_token` (`session_token`),
  KEY `idx_user_sessions_user_id` (`user_id`),
  KEY `idx_user_sessions_token` (`session_token`),
  KEY `idx_user_sessions_active` (`is_active`),
  KEY `idx_user_sessions_last_activity` (`last_activity`),
  CONSTRAINT `UserSessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='사용자 세션 관리 테이블';

-- 테스트 데이터 삽입 (password123 해시값)
INSERT IGNORE INTO `User` (`email`, `password_hash`, `name`, `role`, `created_at`) VALUES
('admin@example.com', '426CD7A39757AD6D303FDBB47EECA56A3588B6C79C67DC8A7DD5607CE7472BA1EEC04BA07192A8D5527BB573C8C79D43C6CC5250EE36520F7DD71A396A572481', '관리자', 'admin', NOW()),
('user1@example.com', '426CD7A39757AD6D303FDBB47EECA56A3588B6C79C67DC8A7DD5607CE7472BA1EEC04BA07192A8D5527BB573C8C79D43C6CC5250EE36520F7DD71A396A572481', '사용자1', 'user', NOW()),
('test@pposeek.com', '426CD7A39757AD6D303FDBB47EECA56A3588B6C79C67DC8A7DD5607CE7472BA1EEC04BA07192A8D5527BB573C8C79D43C6CC5250EE36520F7DD71A396A572481', '테스트사용자', 'user', NOW());
