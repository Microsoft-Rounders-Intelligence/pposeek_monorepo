-- 사용자 테이블

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    -- 🎯 아래 UNIQUE 제약조건 2개를 추가합니다.
    CONSTRAINT UQ_username UNIQUE (username),
    CONSTRAINT UQ_email UNIQUE (email)
);

-- 사용자 세션 테이블
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL,
    session_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_activity ON user_sessions(last_activity);

-- 테스트 데이터 삽입 (SHA-512 암호화된 비밀번호)
-- password123 → SHA-512 해시값 (올바른 PPoseek Salt 포함)
INSERT INTO users (username, email, password_hash, display_name, role, is_active) VALUES
('admin', 'admin@example.com', '426CD7A39757AD6D303FDBB47EECA56A3588B6C79C67DC8A7DD5607CE7472BA1EEC04BA07192A8D5527BB573C8C79D43C6CC5250EE36520F7DD71A396A572481', '관리자', 'ADMIN', TRUE),
('user1', 'user1@example.com', '426CD7A39757AD6D303FDBB47EECA56A3588B6C79C67DC8A7DD5607CE7472BA1EEC04BA07192A8D5527BB573C8C79D43C6CC5250EE36520F7DD71A396A572481', '사용자1', 'USER', TRUE),
('testuser', 'test@pposeek.com', '426CD7A39757AD6D303FDBB47EECA56A3588B6C79C67DC8A7DD5607CE7472BA1EEC04BA07192A8D5527BB573C8C79D43C6CC5250EE36520F7DD71A396A572481', '테스트사용자', 'USER', TRUE);
