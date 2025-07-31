import { apiClient } from './client'

export interface User {
  id: number
  email: string
  name?: string  // 옵셔널로 변경
  displayName?: string  // 백엔드 실제 필드 추가
  phone?: string
  role: string
  profileImage?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface TokenInfo {
  accessToken: string
  tokenType: string
  refreshToken?: string
}

export interface ResponseMessage<T = any> {
  httpStatus: string
  data: T
  message: string
}

export interface LoginResponse {
  httpStatus: string
  data: TokenInfo
  message: string
}

export const authApi = {
  login: (data: LoginRequest) => 
    apiClient.post<LoginResponse>('/auth/login', data),
    
  register: (data: Partial<User> & { password: string }) => 
    apiClient.post<ResponseMessage<User>>('/auth/register', data),
    
  getCurrentUser: (token: string) => 
    apiClient.get<ResponseMessage<User> | User>('/auth/me', { token }),
}
