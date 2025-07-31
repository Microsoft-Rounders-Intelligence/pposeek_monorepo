"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authApi, User } from "@/lib/api/auth"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<boolean>
  hasPermission: (permission: string) => boolean
  isLoading: boolean
}

interface RegisterData {
  username: string
  email: string
  password: string
  displayName?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const PERMISSIONS = {
  user: ["view_jobs", "apply_jobs", "chat_ai", "manage_profile"],
  hr: ["view_jobs", "post_jobs", "view_applications", "manage_candidates"],
  admin: ["view_jobs", "post_jobs", "view_applications", "manage_candidates", "manage_users", "view_analytics"],
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // JWT 토큰 확인 및 사용자 정보 복원
    const token = localStorage.getItem("jwt_token")
    
    if (token) {
      loadUserData(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  const loadUserData = async (token: string) => {
    try {
      const response = await authApi.getCurrentUser(token)
      // 백엔드 ResponseMessage 구조에서 data 추출 (타입 안전하게)
      let userData: User
      
      if ('data' in response && response.data) {
        // ResponseMessage<User> 형태인 경우
        userData = response.data as User
      } else {
        // User 타입 그대로인 경우
        userData = response as User
      }
      
      // displayName을 name으로도 매핑
      const mappedUser: User = {
        ...userData,
        name: userData.name || userData.displayName,
        displayName: userData.displayName || userData.name
      }
      
      setUser(mappedUser)
    } catch (error) {
      console.error("Failed to load user data:", error)
      localStorage.removeItem("jwt_token")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login({ username: email, password })
      
      if (response.data.accessToken) {
        localStorage.setItem("jwt_token", response.data.accessToken)
        await loadUserData(response.data.accessToken)
        return true
      }
      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      const response = await authApi.register(userData)
      return response.httpStatus === "CREATED"
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("jwt_token")
    setUser(null)
  }

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      // TODO: 프로필 업데이트 API 구현 후 연결
      if (user) {
        const updatedUser = { ...user, ...userData }
        setUser(updatedUser)
        return true
      }
      return false
    } catch (error) {
      console.error("Profile update failed:", error)
      return false
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    const userRole = user.role as keyof typeof PERMISSIONS
    return PERMISSIONS[userRole]?.includes(permission) || false
  }

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    hasPermission,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}