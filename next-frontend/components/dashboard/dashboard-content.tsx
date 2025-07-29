"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageCircle,
  FileText,
  Briefcase,
  TrendingUp,
  Search,
  Star,
  MapPin,
  Clock,
  Send,
  UploadCloud,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface JobPosting {
  id: string
  title: string
  company: string
  location: string
  salary: string
  tags: string[]
  postedDate: string
  matchScore: number
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export function DashboardContent() {
  const { user, hasPermission } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "안녕하세요! 취업 준비에 도움을 드리는 AI 어시스턴트입니다. 어떤 도움이 필요하신가요?",
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [resumeText, setResumeText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // 포트폴리오 상태 및 Ref 추가
  const [selectedPortfolio, setSelectedPortfolio] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const portfolioInputRef = useRef<HTMLInputElement>(null)

  const mockJobPostings: JobPosting[] = [
    {
      id: "1",
      title: "프론트엔드 개발자",
      company: "네이버",
      location: "서울 강남구",
      salary: "4000-6000만원",
      tags: ["React", "TypeScript", "Next.js"],
      postedDate: "2일 전",
      matchScore: 95,
    },
    {
      id: "2",
      title: "풀스택 개발자",
      company: "카카오",
      location: "서울 판교",
      salary: "5000-7000만원",
      tags: ["Node.js", "React", "AWS"],
      postedDate: "1일 전",
      matchScore: 88,
    },
    {
      id: "3",
      title: "AI 엔지니어",
      company: "삼성전자",
      location: "서울 서초구",
      salary: "6000-8000만원",
      tags: ["Python", "TensorFlow", "PyTorch"],
      postedDate: "3일 전",
      matchScore: 82,
    },
  ]

  const handleSendMessage = () => {
    if (!chatInput.trim()) return

    const newMessages = [
      ...chatMessages,
      { role: "user" as const, content: chatInput },
      { role: "assistant" as const, content: "네, 좋은 질문이네요! AI가 분석 중입니다..." },
    ]
    setChatMessages(newMessages)
    setChatInput("")
  }

  const handleResumeAnalysis = () => {
    if (!resumeText.trim()) return
    toast({
        title: "분석 요청 완료",
        description: "자소서 분석이 시작되었습니다. 잠시 후 결과를 확인해주세요."
    })
  }

  const handleJobClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`)
  }

  // 포트폴리오 업로드 핸들러
  const handlePortfolioSelectClick = () => {
    portfolioInputRef.current?.click()
  }

  const handlePortfolioFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      // PDF 파일만 허용
      if (event.target.files[0].type === "application/pdf") {
        setSelectedPortfolio(event.target.files[0])
      } else {
        toast({
          title: "파일 형식 오류",
          description: "PDF 파일만 업로드할 수 있습니다.",
          variant: "destructive",
        })
      }
    }
  }

  const handlePortfolioUpload = async () => {
    if (!selectedPortfolio) {
      toast({ title: "파일을 선택해주세요.", variant: "destructive" })
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", selectedPortfolio)

    try {
      const token = localStorage.getItem("jwt_token")
      if (!token) throw new Error("인증 토큰이 없습니다.")

      const response = await fetch("http://localhost:8080/api/files/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("포트폴리오 업로드에 실패했습니다.")
      }

      const fileUrl = await response.text()
      // TODO: 반환된 fileUrl을 유저 정보에 업데이트하는 로직 추가
      console.log("Uploaded portfolio URL:", fileUrl)

      toast({
        title: "업로드 성공",
        description: `${selectedPortfolio.name} 파일이 성공적으로 업로드되었습니다.`,
      })
      setSelectedPortfolio(null)
    } catch (error) {
      console.error(error)
      toast({
        title: "업로드 실패",
        description: "포트폴리오 업로드 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="dashboard" className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4" />
          <span>대시보드</span>
        </TabsTrigger>
        <TabsTrigger value="jobs" className="flex items-center space-x-2">
          <Briefcase className="h-4 w-4" />
          <span>맞춤 공고</span>
        </TabsTrigger>
        {hasPermission("chat_ai") && (
          <TabsTrigger value="chat" className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>AI 상담</span>
          </TabsTrigger>
        )}
        <TabsTrigger value="resume" className="flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>자소서 컨설팅</span>
        </TabsTrigger>
        <TabsTrigger value="portfolio" className="flex items-center space-x-2">
          <Star className="h-4 w-4" />
          <span>포트폴리오</span>
        </TabsTrigger>
      </TabsList>

      {/* Dashboard */}
      <TabsContent value="dashboard" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">추천 공고</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24개</div>
              <p className="text-xs text-muted-foreground">새로운 공고 5개</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">매칭 점수</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">평균 매칭률</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI 상담</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12회</div>
              <p className="text-xs text-muted-foreground">이번 주 상담 횟수</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">지원 현황</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8개</div>
              <p className="text-xs text-muted-foreground">진행 중인 지원</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>최근 활동</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">네이버 프론트엔드 개발자 공고에 관심 표시</p>
                    <p className="text-xs text-gray-500">2시간 전</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">자소서 AI 분석 완료</p>
                    <p className="text-xs text-gray-500">5시간 전</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">포트폴리오 업데이트</p>
                    <p className="text-xs text-gray-500">1일 전</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>추천 공고</CardTitle>
              <CardDescription>당신에게 맞는 최신 채용공고</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockJobPostings.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleJobClick(job.id)}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.company}</p>
                      <Badge variant="secondary" className="text-xs mt-1 bg-emerald-100 text-emerald-800">
                        매칭 {job.matchScore}%
                      </Badge>
                    </div>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      보기
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Jobs */}
      <TabsContent value="jobs" className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              placeholder="직무, 회사명으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Search className="h-4 w-4 mr-2" />
            검색
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/jobs")}
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
          >
            전체 공고 보기
          </Button>
        </div>

        <div className="space-y-4">
          {mockJobPostings.map((job) => (
            <Card
              key={job.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleJobClick(job.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                        매칭 {job.matchScore}%
                      </Badge>
                    </div>
                    <p className="text-gray-600 font-medium mb-2">{job.company}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {job.postedDate}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-3">
                      {job.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="border-emerald-200 text-emerald-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-emerald-600 font-semibold">{job.salary}</p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      지원하기
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                    >
                      관심공고
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      {/* Chat */}
      {hasPermission("chat_ai") && (
        <TabsContent value="chat" className="space-y-6">
          <Card className="h-96">
            <CardHeader>
              <CardTitle>AI 취업 상담</CardTitle>
              <CardDescription>뽀식이 AI와 함께 취업 준비를 해보세요</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto space-y-4 p-4 border rounded-md mb-4 bg-gray-50">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                        message.role === "user" ? "bg-emerald-600 text-white" : "bg-white text-gray-900"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="메시지를 입력하세요..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} className="bg-emerald-600 hover:bg-emerald-700">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      )}

      {/* Resume */}
      <TabsContent value="resume" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>자소서 AI 컨설팅</CardTitle>
            <CardDescription>AI가 자소서를 분석하고 개선점을 제안해드립니다</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="자소서 내용을 입력해주세요..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="min-h-48"
            />
            <Button onClick={handleResumeAnalysis} className="w-full bg-emerald-600 hover:bg-emerald-700">
              AI 분석 시작
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>분석 결과</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <h4 className="font-semibold text-emerald-800 mb-2">강점</h4>
                <p className="text-emerald-700">구체적인 프로젝트 경험과 성과가 잘 드러나 있습니다.</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">개선점</h4>
                <p className="text-yellow-700">지원 동기를 더 구체적으로 작성해보세요.</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">추천 키워드</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge className="bg-emerald-100 text-emerald-800">협업</Badge>
                  <Badge className="bg-emerald-100 text-emerald-800">문제해결</Badge>
                  <Badge className="bg-emerald-100 text-emerald-800">성장</Badge>
                  <Badge className="bg-emerald-100 text-emerald-800">혁신</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Portfolio */}
      <TabsContent value="portfolio" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>포트폴리오 관리</CardTitle>
            <CardDescription>AI가 포트폴리오를 분석하고 개선점을 제안합니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">포트폴리오 업로드</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <UploadCloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <input
                    type="file"
                    ref={portfolioInputRef}
                    onChange={handlePortfolioFileChange}
                    className="hidden"
                    accept=".pdf"
                  />
                  <Button
                    onClick={handlePortfolioSelectClick}
                    className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                  >
                    파일 선택
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">PDF 파일을 업로드 해주세요.</p>
                  {selectedPortfolio && (
                    <div className="mt-4 text-left bg-gray-100 p-3 rounded-md">
                      <p className="font-medium text-sm text-gray-800">선택된 파일:</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 truncate">{selectedPortfolio.name}</span>
                        <Button
                          onClick={handlePortfolioUpload}
                          disabled={isUploading}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          {isUploading ? "업로드 중..." : "업로드"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">AI 분석 결과</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
                    <p className="text-sm">📊 전체 점수: 85/100</p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
                    <p className="text-sm">🎨 디자인: 우수</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-sm">📝 내용 구성: 개선 필요</p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
                    <p className="text-sm">🔧 기술 스택: 우수</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}