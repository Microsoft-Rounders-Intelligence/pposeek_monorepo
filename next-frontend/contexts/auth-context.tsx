"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin" | "hr"
  avatar?: string
  skills: string[]
  experience: string
  location: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<boolean>
  hasPermission: (permission: string) => boolean
}

interface RegisterData {
  email: string
  password: string
  name: string
  skills: string[]
  experience: string
  location: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const PERMISSIONS = {
  user: ["view_jobs", "apply_jobs", "chat_ai", "manage_profile"],
  hr: ["view_jobs", "post_jobs", "view_applications", "manage_candidates"],
  admin: ["view_jobs", "post_jobs", "view_applications", "manage_candidates", "manage_users", "view_analytics"],
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // JWT 토큰 확인 및 사용자 정보 복원
    const token = localStorage.getItem("jwt_token")
    const userData = localStorage.getItem("user_data")

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        localStorage.removeItem("jwt_token")
        localStorage.removeItem("user_data")
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // 실제 구현에서는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const mockUser: User = {
        id: "1",
        email,
        name: email.includes("admin") ? "관리자" : "김개발",
        role: email.includes("admin") ? "admin" : email.includes("hr") ? "hr" : "user",
        skills: ["React", "TypeScript", "Node.js"],
        experience: "3년",
        location: "서울",
        avatar: "/placeholder.svg?height=40&width=40",
      }

      // JWT 토큰 시뮬레이션
      const mockToken = `jwt.${btoa(JSON.stringify({ userId: mockUser.id, role: mockUser.role }))}.signature`

      localStorage.setItem("jwt_token", mockToken)
      localStorage.setItem("user_data", JSON.stringify(mockUser))
      setUser(mockUser)

      return true
    } catch (error) {
      return false
    }
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        role: "user",
        skills: userData.skills,
        experience: userData.experience,
        location: userData.location,
      }

      const mockToken = `jwt.${btoa(JSON.stringify({ userId: newUser.id, role: newUser.role }))}.signature`

      localStorage.setItem("jwt_token", mockToken)
      localStorage.setItem("user_data", JSON.stringify(newUser))
      setUser(newUser)

      return true
    } catch (error) {
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("jwt_token")
    localStorage.removeItem("user_data")
    setUser(null)
  }

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (user) {
        const updatedUser = { ...user, ...userData }
        localStorage.setItem("user_data", JSON.stringify(updatedUser))
        setUser(updatedUser)
      }

      return true
    } catch (error) {
      return false
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    return PERMISSIONS[user.role]?.includes(permission) || false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
