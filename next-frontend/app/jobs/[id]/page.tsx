"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/layout/header"
import { ArrowLeft, MapPin, Clock, DollarSign, Building, Heart, Share2 } from "lucide-react"

interface JobDetail {
  id: string
  title: string
  company: string
  location: string
  salary: string
  employmentType: string
  experience: string
  education: string
  tags: string[]
  postedDate: string
  deadline: string
  matchScore: number
  description: string
  requirements: string[]
  benefits: string[]
  companyInfo: {
    name: string
    size: string
    industry: string
    description: string
    logo: string
  }
}

export default function JobDetailPage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [job, setJob] = useState<JobDetail | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isApplied, setIsApplied] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Mock job data
    const mockJob: JobDetail = {
      id: params.id as string,
      title: "프론트엔드 개발자",
      company: "네이버",
      location: "서울 강남구",
      salary: "4000-6000만원",
      employmentType: "정규직",
      experience: "3년 이상",
      education: "대학교 졸업",
      tags: ["React", "TypeScript", "Next.js", "JavaScript", "CSS"],
      postedDate: "2024-01-18",
      deadline: "2024-02-18",
      matchScore: 95,
      description: `
네이버에서 프론트엔드 개발자를 모집합니다.

우리 팀은 사용자 경험을 최우선으로 생각하며, 최신 기술을 활용하여 혁신적인 웹 서비스를 개발하고 있습니다.
React, TypeScript를 기반으로 한 모던 프론트엔드 개발 경험이 있는 분을 찾고 있습니다.

주요 업무:
- React 기반 웹 애플리케이션 개발 및 유지보수
- 사용자 인터페이스 및 사용자 경험 개선
- 백엔드 개발자와의 협업을 통한 API 연동
- 코드 리뷰 및 기술 문서 작성
      `,
      requirements: [
        "React, TypeScript 3년 이상 실무 경험",
        "HTML, CSS, JavaScript 능숙한 활용",
        "RESTful API 연동 경험",
        "Git을 활용한 협업 경험",
        "웹 표준 및 접근성에 대한 이해",
      ],
      benefits: [
        "4대보험 + 퇴직연금",
        "연봉 협상 가능",
        "유연근무제 (재택근무 가능)",
        "교육비 지원",
        "건강검진 지원",
        "점심 식대 지원",
      ],
      companyInfo: {
        name: "네이버",
        size: "1000명 이상",
        industry: "IT/인터넷",
        description: "대한민국 대표 IT 기업으로, 검색, 커머스, 핀테크 등 다양한 서비스를 제공합니다.",
        logo: "/placeholder.svg?height=60&width=60",
      },
    }

    setJob(mockJob)
  }, [user, router, params.id])

  const handleApply = () => {
    setIsApplied(true)
    toast({
      title: "지원 완료",
      description: "지원이 성공적으로 완료되었습니다.",
    })
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast({
      title: isBookmarked ? "관심공고 해제" : "관심공고 등록",
      description: isBookmarked ? "관심공고에서 제거되었습니다." : "관심공고에 등록되었습니다.",
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "링크 복사 완료",
      description: "채용공고 링크가 클립보드에 복사되었습니다.",
    })
  }

  if (!user || !job) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Back Button */}
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            돌아가기
          </Button>

          {/* Job Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold">{job.title}</h1>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                      매칭 {job.matchScore}%
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={job.companyInfo.logo || "/placeholder.svg"} alt={job.company} />
                      <AvatarFallback>{job.company.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-lg font-semibold text-gray-700">{job.company}</h2>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {job.salary}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {job.experience}
                    </div>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      {job.employmentType}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={handleApply}
                    disabled={isApplied}
                    className="min-w-24 bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isApplied ? "지원완료" : "지원하기"}
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBookmark}
                      className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                    >
                      <Heart className={`h-4 w-4 ${isBookmarked ? "fill-emerald-500 text-emerald-500" : ""}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="border-emerald-200 text-emerald-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle>채용 상세</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{job.description}</pre>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>지원 자격</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-emerald-500 mr-2">•</span>
                        <span className="text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>복리후생</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-emerald-500 mr-2">•</span>
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle>회사 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={job.companyInfo.logo || "/placeholder.svg"} alt={job.companyInfo.name} />
                      <AvatarFallback>{job.companyInfo.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{job.companyInfo.name}</h3>
                      <p className="text-sm text-gray-600">{job.companyInfo.industry}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">규모</span>
                      <span>{job.companyInfo.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">업종</span>
                      <span>{job.companyInfo.industry}</span>
                    </div>
                  </div>

                  <Separator />

                  <p className="text-sm text-gray-700">{job.companyInfo.description}</p>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  >
                    회사 정보 더보기
                  </Button>
                </CardContent>
              </Card>

              {/* Job Info */}
              <Card>
                <CardHeader>
                  <CardTitle>채용 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">게시일</span>
                    <span>{job.postedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">마감일</span>
                    <span className="text-red-600">{job.deadline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">고용형태</span>
                    <span>{job.employmentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">학력</span>
                    <span>{job.education}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">경력</span>
                    <span>{job.experience}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle>유사한 채용공고</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: "React 개발자", company: "카카오", match: 92 },
                    { title: "프론트엔드 엔지니어", company: "라인", match: 89 },
                    { title: "웹 개발자", company: "쿠팡", match: 85 },
                  ].map((similarJob, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-sm">{similarJob.title}</h4>
                          <p className="text-xs text-gray-600">{similarJob.company}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-800">
                          {similarJob.match}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
