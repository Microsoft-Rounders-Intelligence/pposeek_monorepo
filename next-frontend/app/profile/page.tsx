"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/layout/header"
import { User, Settings, FileText, Shield } from "lucide-react"

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    skills: "",
    experience: "",
    location: "",
    bio: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    setFormData({
      name: user.name || "",
      email: user.email || "",
      skills: user.skills?.join(", ") || "",
      experience: user.experience || "",
      location: user.location || "",
      bio: "",
    })
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await updateProfile({
        name: formData.name,
        skills: formData.skills.split(",").map((s) => s.trim()),
        experience: formData.experience,
        location: formData.location,
      })

      if (success) {
        toast({
          title: "프로필 업데이트 완료",
          description: "프로필이 성공적으로 업데이트되었습니다.",
        })
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "프로필 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">프로필 관리</h1>
            <p className="text-gray-600">개인 정보와 설정을 관리하세요</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>기본 정보</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>환경 설정</span>
              </TabsTrigger>
              <TabsTrigger value="resume" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>이력서 관리</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>보안</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>기본 정보</CardTitle>
                  <CardDescription>프로필 정보를 수정할 수 있습니다</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Button
                          type="button"
                          variant="outline"
                          className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                        >
                          프로필 사진 변경
                        </Button>
                        <p className="text-sm text-gray-500 mt-1">JPG, PNG 파일만 업로드 가능합니다</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">이름</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">이메일</Label>
                        <Input id="email" type="email" value={formData.email} disabled className="bg-gray-50" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">경력</Label>
                        <Input
                          id="experience"
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          placeholder="3년, 신입 등"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">지역</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="서울, 부산 등"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills">기술 스택</Label>
                      <Input
                        id="skills"
                        value={formData.skills}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        placeholder="React, TypeScript, Node.js (쉼표로 구분)"
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.skills
                          .split(",")
                          .filter((s) => s.trim())
                          .map((skill, index) => (
                            <Badge key={index} className="bg-emerald-100 text-emerald-800">
                              {skill.trim()}
                            </Badge>
                          ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">자기소개</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        placeholder="간단한 자기소개를 작성해주세요"
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/")}
                        className="border-gray-300"
                      >
                        취소
                      </Button>
                      <Button type="submit" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
                        {isLoading ? "저장 중..." : "저장"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>환경 설정</CardTitle>
                  <CardDescription>알림 및 개인화 설정을 관리하세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">알림 설정</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">새로운 채용공고 알림</p>
                          <p className="text-sm text-gray-500">맞춤 채용공고가 등록되면 알림을 받습니다</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                        >
                          설정
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">지원 현황 알림</p>
                          <p className="text-sm text-gray-500">지원한 공고의 진행 상황을 알림으로 받습니다</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                        >
                          설정
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">개인화 설정</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">AI 추천 정확도</p>
                          <p className="text-sm text-gray-500">더 정확한 추천을 위해 데이터 수집에 동의</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                        >
                          설정
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resume">
              <Card>
                <CardHeader>
                  <CardTitle>이력서 관리</CardTitle>
                  <CardDescription>이력서를 업로드하고 관리하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">이력서를 업로드해주세요</p>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">파일 선택</Button>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">업로드된 이력서</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium">이력서_김개발_2024.pdf</p>
                              <p className="text-sm text-gray-500">2024.01.15 업로드</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                            >
                              다운로드
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                            >
                              삭제
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>보안 설정</CardTitle>
                  <CardDescription>계정 보안을 관리하세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">비밀번호 변경</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">현재 비밀번호</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">새 비밀번호</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">비밀번호 변경</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">로그인 기록</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">현재 세션</p>
                          <p className="text-sm text-gray-500">서울, 대한민국 - Chrome</p>
                          <p className="text-sm text-gray-500">2024.01.20 14:30</p>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-800">활성</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">계정 관리</h3>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full bg-transparent border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      >
                        모든 기기에서 로그아웃
                      </Button>
                      <Button variant="destructive" className="w-full">
                        계정 삭제
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
