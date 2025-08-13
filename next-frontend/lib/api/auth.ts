import {apiClient} from './client';

// --- 타입 정의 ---

// 사용자 정보 타입 (UserDto - MySQL User 테이블 기준)
export interface User {
  userId: number;        // user_id
  email: string;         // email
  name: string;          // name (displayName 대신 name 사용)
  role: string;          // role (admin, user 등)
  createdAt?: string;    // created_at
  lastLogin?: string;    // last_login
}



// 백엔드로부터 받는 토큰 정보 타입 (TokenInfo)
export interface TokenInfo {
  grantType: string;      // "Bearer"
  accessToken: string;    // JWT 토큰
  expiresIn: number;      // 만료 시간 (초)
  userInfo: User;         // 사용자 정보
}

// 로그인 시 서버로 보낼 데이터 타입 (LoginDto)
export interface LoginData {
  username: string; // 백엔드에서는 이메일을 username 필드로 받습니다.
  password: string;
  sessionName?: string; // 세션 이름 (선택사항)
}

// 회원가입 시 서버로 보낼 데이터 타입 (RegisterDto)
export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

// --- API 함수들 ---

/**
 * 로그인 API 호출
 * @param loginData - 로그인 정보 (이메일, 비밀번호)
 * @returns 토큰 정보 (TokenInfo)
 */
export const login = async (loginData: LoginData): Promise<TokenInfo> => {
  // apiClient.post는 AxiosResponse를 반환하므로, .data를 통해 실제 데이터를 추출합니다.
  const response = await apiClient.post<TokenInfo>('/auth/login', loginData);
  console.log('Login response:', response); // 디버깅용 로그
  return response;
};

/**
 * 회원가입 API 호출
 * @param registerData - 회원가입 정보
 * @returns 토큰 정보 (TokenInfo, 자동 로그인)
 */
export const register = async (registerData: RegisterData): Promise<TokenInfo> => {
    const response = await apiClient.post<TokenInfo>('/auth/register', registerData);
    console.log('Register response:', response); // 디버깅용 로그
    return response;
};

/**
 * 현재 로그인된 사용자 정보 조회 API 호출
 * (apiClient가 토큰을 자동으로 헤더에 추가해줍니다.)
 * @returns 사용자 정보 (User)
 */
export const getMe = async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    console.log('Get Me response:', response); // 디버깅용 로그
    return response;
};

/**
 * 로그아웃 API 호출
 */
export const logout = async (): Promise<void> => {
    // 로그아웃은 특별한 응답 데이터가 필요 없을 수 있습니다.
    await apiClient.post('/auth/logout');
};
