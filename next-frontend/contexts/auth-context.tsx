'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import * as authApi from '@/lib/api/auth';
import { User, LoginData, RegisterData, TokenInfo } from '@/lib/api/auth';
import { toast } from '@/components/ui/use-toast';

// 역할별 권한 정의
const PERMISSIONS: Record<string, string[]> = {
  USER: ["view_jobs", "apply_jobs", "chat_ai", "manage_profile"],
  COMPANY: ["view_jobs", "post_jobs", "view_applications", "manage_candidates", "manage_profile"],
  ADMIN: ["view_jobs", "post_jobs", "view_applications", "manage_candidates", "manage_users", "view_analytics"],
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginData: LoginData) => Promise<void>;
  register: (registerData: RegisterData) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();



  // 여기서 렌더링 화면에서도 해당 오류가 뜨는 경우가 있어서 수정필요함. ******************************************** 8월1일.
  useEffect(() => {
    const validateTokenOnLoad = async () => {
      // 🎯 이제 토큰이 있는지 여부만 확인합니다. apiClient가 헤더에 자동으로 추가해줍니다.
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
          console.log("Token validated successfully, user data loaded.");
        } catch (error) {
          console.error('Token validation failed on load:', error);
          localStorage.removeItem('accessToken');
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    validateTokenOnLoad();
  }, []);

  // 로그인/회원가입 성공 시 공통 처리 함수
  const handleAuthSuccess = (response: TokenInfo, successMessage: string) => {
    if (response && response.accessToken && response.userInfo) {
      // 🎯 여기서 토큰을 저장하면, apiClient가 모든 다음 요청부터 자동으로 사용합니다.
      localStorage.setItem('accessToken', response.accessToken);
      console.log('response accesstoken:', response.accessToken); // 디버깅용 로그
      setUser(response.userInfo);
      toast({ title: successMessage, description: `${response.userInfo.displayName}님, 환영합니다.` });
      router.push('/dashboard');
      return true;
    }
    return false;
  };

  const login = async (loginData: LoginData) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(loginData);
      if (!handleAuthSuccess(response, "로그인 성공")) {
        throw new Error('서버로부터 올바른 응답을 받지 못했습니다.');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data || '로그인 중 오류가 발생했습니다.';
      toast({
        title: "로그인 실패",
        description: typeof errorMessage === 'string' ? errorMessage : '아이디 또는 비밀번호를 확인해주세요.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (registerData: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(registerData);
      console.log('Register response:', response); // 디버깅용 로그
      if (!handleAuthSuccess(response, "회원가입 성공")) {
        throw new Error('회원가입 응답이 올바르지 않습니다.');
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      const errorMessage = error.response?.data || '회원가입 중 오류가 발생했습니다.';
      toast({
        title: "회원가입 실패",
        description: typeof errorMessage === 'string' ? errorMessage : '이미 사용 중인 아이디 또는 이메일일 수 있습니다.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    // 🎯 토큰을 삭제하면, apiClient는 더 이상 인증 헤더를 보내지 않습니다.
    localStorage.removeItem('accessToken');
    toast({ title: "로그아웃", description: "성공적으로 로그아웃되었습니다." });
    router.push('/login');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.role) return false;
    const userRole = user.role.toUpperCase() as keyof typeof PERMISSIONS;
    return PERMISSIONS[userRole]?.includes(permission) || false;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
