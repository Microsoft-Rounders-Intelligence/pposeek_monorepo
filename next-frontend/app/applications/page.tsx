"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/layout/header"
import { Search, Calendar, Building, MapPin, Clock, Eye, FileText } from "lucide-react"

interface Application {
  id: string
  jobTitle: string
  company: string
  location: string
  appliedDate: string
  status: "pending" | "reviewing" | "interview" | "rejected" | "accepted"
  lastUpdate: string
  interviewDate?: string
}

const statusLabels = {
  pending: "지원완료",
  reviewing: "서류심사",
  interview: "면접대기",
  rejected: "불합격",
  accepted: "합격",
}

const statusColors = {
  pending: "bg-blue-100 text-blue-800",
  reviewing: "bg-yellow-100 text-yellow-800",
  interview: "bg-purple-100 text-purple-800",
  rejected: "bg-red-100 text-red-800",
  accepted: "bg-emerald-100 text-emerald-800",
}

export default function ApplicationsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Mock applications data
    const mockApplications: Application[] = [
      {
        id: "1",
        jobTitle: "프론트엔드 개발자",
        company: "네이버",
        location: "서울 강남구",
        appliedDate: "2024-01-15",
        status: "interview",
        lastUpdate: "2024-01-18",
        interviewDate: "2024-01-22",
      },
      {
        id: "2",
        jobTitle: "풀스택 개발자",
        company: "카카오",
        location: "서울 판교",
        appliedDate: "2024-01-12",
        status: "reviewing",
        lastUpdate: "2024-01-16",
      },
      {
        id: "3",
        jobTitle: "React 개발자",
        company: "토스",
        location: "서울 강남구",
        appliedDate: "2024-01-10",
        status: "accepted",
        lastUpdate: "2024-01-17",
      },
      {
        id: "4",
        jobTitle: "웹 개발자",
        company: "배달의민족",
        location: "서울 송파구",
        appliedDate: "2024-01-08",
        status: "rejected",
        lastUpdate: "2024-01-14",
      },
      {
        id: "5",
        jobTitle: "JavaScript 개발자",
        company: "라인",
        location: "서울 강남구",
        appliedDate: "2024-01-05",
        status: "pending",
        lastUpdate: "2024-01-05",
      },
    ]

    setApplications(mockApplications)
  }, [user, router])

  const filteredApplications = applications.filter(
    (app) =>
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getApplicationsByStatus = (status: string) => {
    return filteredApplications.filter((app) => app.status === status)
  }

  const getStatusCount = (status: string) => {
    return applications.filter((app) => app.status === status).length
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">지원 현황</h1>
            <p className="text-gray-600">지원한 채용공고의 진행 상황을 확인하세요</p>
          </div>

          {/* Search */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="회사명, 직무로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
            </div>
            <Button
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
            >
              <Search className="h-4 w-4 mr-2" />
              검색
            </Button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{getStatusCount("pending")}</div>
                <div className="text-sm text-gray-600">지원완료</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{getStatusCount("reviewing")}</div>
                <div className="text-sm text-gray-600">서류심사</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{getStatusCount("interview")}</div>
                <div className="text-sm text-gray-600">면접대기</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">{getStatusCount("accepted")}</div>
                <div className="text-sm text-gray-600">합격</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{getStatusCount("rejected")}</div>
                <div className="text-sm text-gray-600">불합격</div>
              </CardContent>
            </Card>
          </div>

          {/* Applications List */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">전체 ({filteredApplications.length})</TabsTrigger>
              <TabsTrigger value="pending">지원완료 ({getStatusCount("pending")})</TabsTrigger>
              <TabsTrigger value="reviewing">서류심사 ({getStatusCount("reviewing")})</TabsTrigger>
              <TabsTrigger value="interview">면접대기 ({getStatusCount("interview")})</TabsTrigger>
              <TabsTrigger value="accepted">합격 ({getStatusCount("accepted")})</TabsTrigger>
              <TabsTrigger value="rejected">불합격 ({getStatusCount("rejected")})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ApplicationsList applications={filteredApplications} />
            </TabsContent>
            <TabsContent value="pending">
              <ApplicationsList applications={getApplicationsByStatus("pending")} />
            </TabsContent>
            <TabsContent value="reviewing">
              <ApplicationsList applications={getApplicationsByStatus("reviewing")} />
            </TabsContent>
            <TabsContent value="interview">
              <ApplicationsList applications={getApplicationsByStatus("interview")} />
            </TabsContent>
            <TabsContent value="accepted">
              <ApplicationsList applications={getApplicationsByStatus("accepted")} />
            </TabsContent>
            <TabsContent value="rejected">
              <ApplicationsList applications={getApplicationsByStatus("rejected")} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

function ApplicationsList({ applications }: { applications: Application[] }) {
  const router = useRouter()

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">지원 내역이 없습니다.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold">{application.jobTitle}</h3>
                  <Badge className={statusColors[application.status]}>{statusLabels[application.status]}</Badge>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-1" />
                    {application.company}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {application.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    지원일: {application.appliedDate}
                  </div>
                </div>

                {application.interviewDate && (
                  <div className="flex items-center text-sm text-purple-600 mb-2">
                    <Clock className="h-4 w-4 mr-1" />
                    면접일: {application.interviewDate}
                  </div>
                )}

                <p className="text-sm text-gray-500">최종 업데이트: {application.lastUpdate}</p>
              </div>

              <div className="flex flex-col space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/jobs/${application.id}`)}
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  공고 보기
                </Button>
                {application.status === "interview" && (
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                    면접 준비
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
