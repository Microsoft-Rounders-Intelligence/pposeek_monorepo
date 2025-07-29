import { apiClient } from './client'

export interface User {
  id: number
  email: string
  name: string
  phone: string
  role: string
  profileImage?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export const authApi = {
  login: (data: LoginRequest) => 
    apiClient.post<LoginResponse>('/auth/login', data),
    
  signup: (data: Partial<User> & { password: string }) => 
    apiClient.post<User>('/auth/signup', data),
    
  logout: (token: string) => 
    apiClient.post<void>('/auth/logout', undefined, { token }),
    
  getCurrentUser: (token: string) => 
    apiClient.get<User>('/auth/me', { token }),
}
