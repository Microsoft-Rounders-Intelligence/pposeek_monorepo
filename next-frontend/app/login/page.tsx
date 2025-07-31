"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogoText } from "@/components/ui/logo-text"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const success = await login(email, password)
      if (success) {
        toast({
          title: "로그인 성공",
          description: "환영합니다!",
        })
        router.push("/")
      } else {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.")
      }
    } catch (error) {
      setError("로그인 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-left">
          <div className="mb-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ←
            </Button>
          </div>
          <div className="flex justify-center mb-4">
            <LogoText size="lg" />
          </div>
          
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">로그인</TabsTrigger>
              <TabsTrigger value="register">회원가입</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}  
                &nbsp;

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  로그인
                </Button>
                


              </form>

              <div className="mt-4 text-center text-sm text-gray-600">
               
              </div>
            </TabsContent>

            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    phone: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { register } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      setIsLoading(false)
      return
    }

    try {
      const success = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName,
      })

      if (success) {
        toast({
          title: "회원가입 성공",
          description: "환영합니다!",
        })
        router.push("/") // "/"를 "/dashboard"로 변경
      } else {
        setError("회원가입 중 오류가 발생했습니다.")
      }
    } catch (error) {
      setError("회원가입 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reg-username">사용자명</Label>
        <Input
          id="reg-username"
          placeholder="사용자명을 입력하세요"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-email">이메일</Label>
        <Input
          id="reg-email"
          type="email"
          placeholder="이메일을 입력하세요"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-display-name">표시명 (선택)</Label>
        <Input
          id="reg-display-name"
          placeholder="표시명을 입력하세요"
          value={formData.displayName}
          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-phone">전화번호 (선택)</Label>
        <Input
          id="reg-phone"
          placeholder="전화번호를 입력하세요"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-password">비밀번호</Label>
        <Input
          id="reg-password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-confirm-password">비밀번호 확인</Label>
        <Input
          id="reg-confirm-password"
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          required
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        회원가입
      </Button>
    </form>
  )
}
