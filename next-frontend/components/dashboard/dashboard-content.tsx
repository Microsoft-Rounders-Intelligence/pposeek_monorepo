"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  FileText,
  Briefcase,
  Star,
  MapPin,
  Clock,
  Send,
  UploadCloud,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Target,
  Lightbulb,
  Users,
  Edit3,
  Download,
  Calendar,
  Building,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { resumeApi } from "@/lib/api/resume"
import SockJS from "sockjs-client"
import { Client } from "@stomp/stompjs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

interface JobPosting {
  id: string
  title: string
  company: string
  location: string
  salary: string
  tags: string[]
  postedDate: string
  matchScore: number
  description: string
  requirements: string[]
  benefits: string[]
  recommendationReason: string
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface AnalysisFeedback {
  userId: string
  strengths: string
  weaknesses: string
  suggestions: string
  status: string
}

interface StepStatus {
  step1: boolean // 이력서 분석 완료
  step2: boolean // 맞춤공고 확인 완료
  step3: boolean // 직무 선택 완료 (선택 안해도 완료 가능)
  step4: boolean // 챗봇 상담 완료
  step5: boolean // 최종 자기소개서 작성 완료
}

interface CoverLetter {
  id: string
  jobTitle: string
  company: string
  content: string
  createdAt: string
  status: "draft" | "completed"
}

export function DashboardContent() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // 현재 단계 관리
  const [currentStep, setCurrentStep] = useState(1)
  const [stepStatus, setStepStatus] = useState<StepStatus>({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
  })

  // 대시보드 모드 관리 (첫화면을 대시보드로)
  const [showDashboard, setShowDashboard] = useState(true)
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([
    // 예시 데이터
    {
      id: "1",
      jobTitle: "프론트엔드 개발자",
      company: "네이버",
      content: "안녕하세요. 프론트엔드 개발자 포지션에 지원하는...",
      createdAt: "2024-01-15",
      status: "completed",
    },
    {
      id: "2",
      jobTitle: "풀스택 개발자",
      company: "카카오",
      content: "안녕하세요. 풀스택 개발자 포지션에 지원하는...",
      createdAt: "2024-01-10",
      status: "completed",
    },
  ])
  // ⭐️ 1. 모달 상태 관리를 위한 state 추가
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<CoverLetter | null>(null)

  // ⭐️ 2. "보기" 버튼 클릭 시 모달을 여는 함수
  const handleViewCoverLetter = (coverLetter: CoverLetter) => {
    setSelectedCoverLetter(coverLetter)
    setIsViewModalOpen(true)
  }
  

  // 기존 상태들
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "지원자님의 이력서에 맞는 자기소개서에요! \r\n원하시는 직무나 기업이 없었다면, 저에게 말씀해주세요! 😊\n\n 자기소개서 작성에 수정이 필요하시면 언제든지 말씀해주세요! ✨",
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [finalCoverLetter, setFinalCoverLetter] = useState("")
  const [step4CoverLetter, setStep4CoverLetter] = useState("")

  // 이력서 관련 상태
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const resumeInputRef = useRef<HTMLInputElement>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisFeedback | null>(null)

  // 직무 선택 관련 상태
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null)
  const [skipJobSelection, setSkipJobSelection] = useState(false)

  // 웹소켓 클라이언트
  const stompClient = useRef<Client | null>(null)

  // 모의 채용공고 데이터 (더 상세한 정보 포함)
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
      description: "사용자 경험을 중시하는 프론트엔드 개발자를 찾습니다.",
      requirements: ["React 3년 이상", "TypeScript 경험", "반응형 웹 개발"],
      benefits: ["재택근무 가능", "교육비 지원", "건강검진"],
      recommendationReason:
        "귀하의 React와 TypeScript 경험이 이 포지션과 95% 일치합니다. 특히 컴포넌트 설계 능력이 뛰어나시네요.",
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
      description: "백엔드와 프론트엔드를 모두 다룰 수 있는 개발자를 모집합니다.",
      requirements: ["Node.js 경험", "클라우드 서비스 이해", "데이터베이스 설계"],
      benefits: ["스톡옵션", "유연근무제", "점심 제공"],
      recommendationReason: "풀스택 개발 경험과 클라우드 인프라 이해도가 높아 이 포지션에 적합합니다.",
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
      description: "AI/ML 모델 개발 및 최적화를 담당할 엔지니어를 찾습니다.",
      requirements: ["Python 숙련", "머신러닝 프레임워크 경험", "수학/통계 지식"],
      benefits: ["연구개발비 지원", "논문 발표 기회", "해외 컨퍼런스 참가"],
      recommendationReason: "Python과 머신러닝 프로젝트 경험이 이 AI 포지션과 잘 맞습니다.",
    },
  ]

  // 스텝 4 진입 시 자동으로 자기소개서 생성
  useEffect(() => {
    if (currentStep === 4 && !step4CoverLetter) {
      const generatedCoverLetter = generateCoverLetterDraft()
      setStep4CoverLetter(generatedCoverLetter)
      toast({
        title: "🤖 맞춤형 자기소개서 생성 완료",
        description: "이력서와 선택한 직무를 바탕으로 자기소개서를 생성했습니다.",
      })
    }
  }, [currentStep])

  // 스텝 5 진입 시 스텝 4의 자기소개서 가져오기
  useEffect(() => {
    if (currentStep === 5 && step4CoverLetter && !finalCoverLetter) {
      setFinalCoverLetter(step4CoverLetter)
    }
  }, [currentStep, step4CoverLetter])

  // 웹소켓 연결 (기존 로직 유지)
  useEffect(() => {
    if (user && user.userId) {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        console.error("WebSocket connection failed: Access Token not found.")
        toast({
          title: "인증 오류",
          description: "로그인 정보가 없어 실시간 알림을 시작할 수 없습니다.",
          variant: "destructive",
        })
        return
      }

      const client = new Client({
        webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
        connectHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
        debug: (str) => {
          console.log(`STOMP: ${str}`)
        },
        onConnect: () => {
          console.log("WebSocket Connected!")
          client.subscribe(`/user/queue/feedback`, (message) => {
            const feedback = JSON.parse(message.body) as AnalysisFeedback
            console.log("Feedback received:", feedback)
            setAnalysisResult(feedback)
            setStepStatus((prev) => ({ ...prev, step1: true }))
            toast({
              title: "🎉 이력서 분석 완료!",
              description: "AI 분석 결과를 확인하고 다음 단계로 진행하세요.",
            })
          })

          client.subscribe(`/user/queue/notifications`, (message) => {
            const notification = JSON.parse(message.body)
            console.log("Notification received:", notification)
            toast({
              title: "🔔 새로운 알림",
              description: notification.message,
            })
          })
        },
        onStompError: (frame) => {
          console.error("Broker reported error: " + frame.headers["message"])
          console.error("Additional details: " + frame.body)
          toast({
            title: "연결 오류",
            description: "실시간 알림 연결에 실패했습니다.",
            variant: "destructive",
          })
        },
      })

      client.activate()
      stompClient.current = client

      return () => {
        if (stompClient.current) {
          stompClient.current.deactivate()
          console.log("WebSocket Disconnected")
        }
      }
    }
  }, [user, toast])

  // 이력서 파일 관련 함수들
  const handleResumeFileSelect = () => {
    resumeInputRef.current?.click()
  }

  const handleResumeFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].type === "application/pdf") {
        setResumeFile(event.target.files[0])
        setAnalysisResult(null)
      } else {
        toast({
          title: "파일 형식 오류",
          description: "PDF 파일만 업로드할 수 있습니다.",
          variant: "destructive",
        })
      }
    }
  }

  const handleResumeAnalysis = async () => {
    if (!resumeFile || !user) {
      toast({ title: "분석할 이력서 파일을 선택해주세요.", variant: "destructive" })
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", resumeFile)
    formData.append("userId", String(user.userId))

    const token = localStorage.getItem("accessToken")
    if (!token) {
      toast({ title: "로그인이 필요합니다.", variant: "destructive" })
      setIsUploading(false)
      return
    }

    try {
      toast({
        title: "💡 분석 요청 시작",
        description: "이력서를 분석 중입니다. 잠시만 기다려주세요!",
      })

      const response = (await resumeApi.analyze(formData, token)) as { data: string }

      toast({
        title: "✅ 분석 요청 완료",
        description: response.data || "분석이 시작되었습니다. 결과는 실시간으로 전달됩니다.",
      })

      setResumeFile(null)
    } catch (error) {
      toast({
        title: "요청 실패",
        description: "이력서 분석 요청 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  // 단계 이동 함수들 (진행도 게이지 수정)
  const goToNextStep = () => {
    if (currentStep < 5) {
      // 현재 단계를 완료로 표시
      setStepStatus((prev) => ({ ...prev, [`step${currentStep}` as keyof StepStatus]: true }))
      setCurrentStep(currentStep + 1)
    }
  }

    // 이전 단계로 이동하는 함수 수정
  const goToPrevStep = () => {
    if (currentStep > 1) {
      // 현재 단계의 완료 상태를 false로 초기화
      
      setCurrentStep(currentStep - 1)
    }
  }

  // 단계별 완료 처리 (스텝 3 상태 관리 개선)
  const completeStep3 = (skipSelection?: boolean) => {
    if (skipSelection) {
      setSelectedJob(null) // 직무 선택 초기화
      setSkipJobSelection(true)
    } else {
      setSkipJobSelection(false) // 스킵 상태 초기화
    }
    setStepStatus((prev) => ({ ...prev, step3: true }))
  }

  // 직무 선택 시 스킵 상태 초기화
  const handleJobSelection = (job: JobPosting) => {
    setSelectedJob(job)
    setSkipJobSelection(false) // 직무 선택 시 스킵 상태 초기화
  }

  // 최종 완료 처리
  const handleFinalCompletion = () => {
    const newCoverLetter: CoverLetter = {
      id: Date.now().toString(),
      jobTitle: selectedJob ? selectedJob.title : "일반 개발자",
      company: selectedJob ? selectedJob.company : "일반 지원",
      content: finalCoverLetter,
      createdAt: new Date().toLocaleDateString(),
      status: "completed",
    }

    setCoverLetters((prev) => [...prev, newCoverLetter])
    setStepStatus((prev) => ({ ...prev, step5: true }))
    setShowDashboard(true)

    toast({
      title: "🎉 자기소개서 작성 완료!",
      description: "대시보드에서 작성한 자기소개서를 확인할 수 있습니다.",
    })
  }

  // 챗봇 메시지 전송 (스텝 4에서 자기소개서 수정)
  const handleSendMessage = () => {
    if (!chatInput.trim()) return

    const newMessages = [...chatMessages, { role: "user" as const, content: chatInput }]

    // 자기소개서 수정 요청 처리
    let assistantResponse = ""
    let updatedCoverLetter = step4CoverLetter

    if (chatInput.includes("수정") || chatInput.includes("바꿔") || chatInput.includes("변경")) {
      // 간단한 수정 로직 (실제로는 AI API 호출)
      if (chatInput.includes("지원동기") || chatInput.includes("동기")) {
        updatedCoverLetter = step4CoverLetter.replace(
          /【지원 동기】[\s\S]*?【/,
          `【지원 동기】\n사용자 요청에 따라 수정된 지원 동기입니다. ${chatInput}에 맞게 내용을 조정했습니다.\n\n【`,
        )
        assistantResponse = "지원 동기 부분을 수정했습니다. 확인해보세요!"
      } else if (chatInput.includes("경험") || chatInput.includes("역량")) {
        updatedCoverLetter = step4CoverLetter.replace(
          /【핵심 역량 및 경험】[\s\S]*?【/,
          `【핵심 역량 및 경험】\n사용자 요청에 따라 수정된 핵심 역량입니다. ${chatInput}에 맞게 내용을 보완했습니다.\n\n【`,
        )
        assistantResponse = "핵심 역량 및 경험 부분을 수정했습니다!"
      } else {
        assistantResponse = `"${chatInput}" 요청을 반영하여 자기소개서를 수정했습니다. 어떤 부분을 더 수정하고 싶으신가요?`
      }

      setStep4CoverLetter(updatedCoverLetter)
    } else {
      assistantResponse = selectedJob
        ? `${selectedJob.title} 포지션에 대한 좋은 질문이네요! 구체적으로 어떤 부분을 수정하고 싶으신지 말씀해주세요.`
        : "어떤 부분을 수정하고 싶으신지 구체적으로 말씀해주세요!"
    }

    newMessages.push({ role: "assistant" as const, content: assistantResponse })
    setChatMessages(newMessages)
    setChatInput("")
  }

  // CoT 방식 자기소개서 초안 생성
  const generateCoverLetterDraft = () => {
    const jobInfo = selectedJob ? `${selectedJob.title} - ${selectedJob.company}` : "개발자"
    const strengths =
      analysisResult?.strengths || "다양한 기술 스택과 프로젝트 경험을 보유하고 있으며, 문제 해결 능력이 뛰어남"
    const weaknesses = analysisResult?.weaknesses || "지속적인 학습과 성장이 필요한 영역들이 있음"

    return `${selectedJob ? `[${selectedJob.title} 지원 자기소개서]` : "[개발자 자기소개서]"}

안녕하세요. ${jobInfo} 포지션에 지원하는 [이름]입니다.

【지원 동기】
${
  selectedJob
    ? `${selectedJob.company}의 ${selectedJob.title} 포지션에 지원하게 된 이유는 ${selectedJob.recommendationReason.slice(0, 100)}... 때문입니다. 특히 ${selectedJob.tags.slice(0, 2).join("과 ")} 기술을 활용한 프로젝트 경험이 이 직무와 높은 연관성을 가지고 있다고 생각합니다.`
    : "개발자로서의 전문성을 발휘하고 지속적으로 성장할 수 있는 환경에서 일하고 싶어 지원하게 되었습니다."
}

【핵심 역량 및 경험】
저의 주요 강점은 다음과 같습니다:
${strengths}

${
  selectedJob
    ? `이러한 경험을 바탕으로 ${selectedJob.company}에서 요구하는 ${selectedJob.requirements.join(", ")} 등의 역량을 충분히 발휘할 수 있을 것입니다.`
    : "이러한 역량을 바탕으로 팀의 목표 달성에 기여하고 싶습니다."
}

【성장 계획】
현재 ${weaknesses.includes("필요") ? "부족한 부분들을" : "개선이 필요한 영역들을"} 지속적으로 학습하며 보완해나가고 있습니다. 
${selectedJob ? `특히 ${selectedJob.tags[selectedJob.tags.length - 1]} 관련 기술을 더욱 깊이 있게 학습하여 ` : ""}회사와 함께 성장하는 개발자가 되겠습니다.

감사합니다.`
  }

 
  const getProgress = () => {
    // 5단계 프로세스입니다. 현재 단계에 따라 진행률을 표시합니다.
    // 예: 1단계 시작 시 0%, 2단계 시작 시 20%, ..., 5단계 시작 시 80%
    // 최종 완료 시 100%가 됩니다.
    if (stepStatus.step5) {
      return 100;
    }
    return ((currentStep - 1) / 4) * 100;
  };

  // 중복 표현 확인 함수
  const checkDuplicateExpressions = (text: string) => {
    if (!text.trim()) return { count: 0, duplicates: [], percentage: 0 }

    // 텍스트를 문장 단위로 분리
    const sentences = text
      .split(/[.!?。]/g)
      .map(s => s.trim().replace(/\s+/g, ' '))
      .filter(s => s.length > 5) // 5자 이하 짧은 문장 제외

    if (sentences.length === 0) return { count: 0, duplicates: [], percentage: 0 }

    // 유사 문장 찾기 (단순화된 방식)
    const duplicates = []
    const checked = new Set<number>()

    for (let i = 0; i < sentences.length - 1; i++) {
      if (checked.has(i)) continue
      
      const sentence1 = sentences[i].toLowerCase()
      const similarSentences = [sentence1]

      for (let j = i + 1; j < sentences.length; j++) {
        if (checked.has(j)) continue
        
        const sentence2 = sentences[j].toLowerCase()
        
        // 단어 기반 유사도 계산 (간단한 방식)
        const words1 = sentence1.split(/\s+/)
        const words2 = sentence2.split(/\s+/)
        
        const commonWords = words1.filter(word => 
          word.length > 1 && words2.includes(word)
        ).length
        
        const totalWords = Math.max(words1.length, words2.length)
        const similarity = commonWords / totalWords
        
        // 유사도 60% 이상이면 중복으로 판단
        if (similarity >= 0.6) {
          similarSentences.push(sentence2)
          checked.add(j)
        }
      }

      if (similarSentences.length > 1) {
        duplicates.push({
          sentences: similarSentences,
          count: similarSentences.length
        })
        checked.add(i)
      }
    }

    const totalDuplicateCount = duplicates.reduce((sum, group) => sum + group.count - 1, 0)
    const percentage = sentences.length > 0 ? (totalDuplicateCount / sentences.length * 100) : 0

    return {
      count: totalDuplicateCount,
      duplicates: duplicates,
      percentage: Math.round(percentage)
    }
  }

  // 대시보드 렌더링
  const renderDashboard = () => {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">자기소개서 대시보드</CardTitle>
            <CardDescription className="text-center">
              작성한 자기소개서를 관리하고 다운로드할 수 있습니다.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 새 자기소개서 작성 카드 (첫 번째로 배치) */}
          <Card className="border-dashed border-2 border-gray-300 hover:border-emerald-500 cursor-pointer transition-colors">
            <CardContent className="flex flex-col items-center justify-center h-full p-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="h-8 w-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">새 자기소개서 작성</h3>
                  <p className="text-gray-600 text-sm">새로운 자기소개서를 작성해보세요</p>
                </div>
                <Button
                  onClick={() => {
                    setShowDashboard(false)
                    setCurrentStep(1)
                    // 상태 초기화
                    setStepStatus({
                      step1: false,
                      step2: false,
                      step3: false,
                      step4: false,
                      step5: false,
                    })
                    setSelectedJob(null)
                    setSkipJobSelection(false)
                    setStep4CoverLetter("")
                    setFinalCoverLetter("")
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  시작하기
                </Button>
              </div>
            </CardContent>
          </Card>

          {coverLetters.map((coverLetter) => (
            <Card key={coverLetter.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{coverLetter.jobTitle}</span>
                  <Badge variant={coverLetter.status === "completed" ? "default" : "secondary"}>
                    {coverLetter.status === "completed" ? "완료" : "임시저장"}
                  </Badge>
                </CardTitle>
                <CardDescription className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-1" />
                    {coverLetter.company}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {coverLetter.createdAt}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 line-clamp-3">{coverLetter.content.slice(0, 150)}...</div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleViewCoverLetter(coverLetter)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      보기
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      다운로드
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ⭐️ 4. 자기소개서 보기 모달 (Dialog) 추가 */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedCoverLetter?.jobTitle}</DialogTitle>
              <DialogDescription>
                {selectedCoverLetter?.company} | 작성일: {selectedCoverLetter?.createdAt}
              </DialogDescription>
            </DialogHeader>
            <div className="prose max-w-none h-[60vh] overflow-y-auto p-4 bg-gray-50 rounded-md">
              <pre className="whitespace-pre-wrap text-sm font-sans">{selectedCoverLetter?.content}</pre>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  닫기
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      

      
    )
  }

  // 단계별 렌더링
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm font-bold">STEP 1</div>
                <FileText className="h-6 w-6 text-emerald-600" />
                <span>이력서 분석</span>
                {stepStatus.step1 && <CheckCircle className="h-5 w-5 text-green-500" />}
              </CardTitle>
              <CardDescription>PDF 이력서를 업로드하면 AI가 분석하여 피드백을 알려드립니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 이력서 업로드 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">이력서 업로드</h3>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition-colors"
                    onClick={handleResumeFileSelect}
                  >
                    <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
                    <input
                      type="file"
                      ref={resumeInputRef}
                      onChange={handleResumeFileChange}
                      className="hidden"
                      accept=".pdf"
                    />
                    <p className="text-gray-600">클릭 또는 파일을 드래그하여 업로드</p>
                    <p className="text-xs text-gray-500 mt-2">PDF 파일만 가능</p>
                  </div>

                  {resumeFile && (
                    <div className="mt-4 text-left bg-gray-100 p-3 rounded-md">
                      <p className="font-medium text-sm text-gray-800">선택된 파일:</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 truncate">{resumeFile.name}</span>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleResumeAnalysis}
                    disabled={isUploading || !resumeFile}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    {isUploading ? "분석 요청 중..." : "AI 분석 시작"}
                  </Button>
                </div>

                {/* AI 분석 결과 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">AI 분석 결과</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <h4 className="font-semibold text-emerald-800 mb-2 flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        강점
                      </h4>
                      <p className="text-emerald-700">
                        {analysisResult ? analysisResult.strengths : "분석 대기 중..."}
                      </p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        약점
                      </h4>
                      <p className="text-red-700">
                    {analysisResult ? analysisResult.weaknesses : "분석 대기 중..."}
                    </p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        개선점
                      </h4>
                      <p className="text-yellow-700">
                        {analysisResult ? analysisResult.suggestions : "분석 대기 중..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm font-bold">STEP 2</div>
                <Briefcase className="h-6 w-6 text-emerald-600" />
                <span>맞춤 공고 추천</span>
                {stepStatus.step2 && <CheckCircle className="h-5 w-5 text-green-500" />}
              </CardTitle>
              <CardDescription>이력서 분석 결과를 바탕으로 맞춤형 채용공고를 추천해드립니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {mockJobPostings.map((job) => (
                  <Card key={job.id} className="border-l-4 border-l-emerald-500">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">{job.title}</h3>
                            <Badge className="bg-emerald-100 text-emerald-800">매칭 {job.matchScore}%</Badge>
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
                          <p className="text-emerald-600 font-semibold mb-3">{job.salary}</p>
                        </div>
                      </div>

                      {/* 추천 이유 */}
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                        <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                          <Star className="h-4 w-4 mr-2" />
                          추천 이유
                        </h4>
                        <p className="text-blue-700 text-sm">{job.recommendationReason}</p>
                      </div>

                      {/* 상세 정보 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-medium text-gray-800 mb-2">주요 요구사항</h5>
                          <ul className="list-disc list-inside text-gray-600 space-y-1">
                            {job.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-800 mb-2">복리혜택</h5>
                          <ul className="list-disc list-inside text-gray-600 space-y-1">
                            {job.benefits.map((benefit, index) => (
                              <li key={index}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm font-bold">STEP 3</div>
                <Users className="h-6 w-6 text-emerald-600" />
                <span>직무 선택</span>
                {stepStatus.step3 && <CheckCircle className="h-5 w-5 text-green-500" />}
              </CardTitle>
              <CardDescription>
                관심 있는 직무를 선택하시거나, 선택하지 않고 다음 단계로 진행할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 선택된 직무 또는 일반적인 직무 준비 중 하나만 표시 */}
              {selectedJob && !skipJobSelection && (
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 mb-6">
                  <h4 className="font-semibold text-emerald-800 mb-2">선택된 직무</h4>
                  <p className="text-emerald-700">
                    {selectedJob.title} - {selectedJob.company}
                  </p>
                </div>
              )}

              {skipJobSelection && !selectedJob && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">일반적인 직무 준비</h4>
                  <p className="text-gray-700">특정 직무를 선택하지 않고 일반적인 취업 준비를 진행합니다.</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockJobPostings.map((job) => (
                  <Card
                    key={job.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedJob?.id === job.id ? "ring-2 ring-emerald-500 bg-emerald-50" : ""
                    }`}
                    onClick={() => handleJobSelection(job)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{job.title}</h4>
                        <Badge className="bg-emerald-100 text-emerald-800 text-xs">{job.matchScore}%</Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{job.company}</p>
                      <div className="flex flex-wrap gap-1">
                        {job.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {job.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={() => completeStep3(true)}
                  variant="outline"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                >
                  직무 선택 없이 진행
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm font-bold">STEP 4</div>
                <MessageCircle className="h-6 w-6 text-emerald-600" />
                <span>AI 상담 및 자기소개서 개발</span>
                {stepStatus.step4 && <CheckCircle className="h-5 w-5 text-green-500" />}
              </CardTitle>
              <CardDescription>
                지원자님의 선택한 직무와 이력서에 맞는 자기소개서에요! 수정하고 싶은 부분이 있으시면 말씀해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedJob && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">선택된 직무 정보</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-700">
                        <strong>직무:</strong> {selectedJob.title}
                      </p>
                      <p className="text-blue-700">
                        <strong>회사:</strong> {selectedJob.company}
                      </p>
                      <p className="text-blue-700">
                        <strong>위치:</strong> {selectedJob.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-700">
                        <strong>주요 기술:</strong> {selectedJob.tags.join(", ")}
                      </p>
                      <p className="text-blue-700">
                        <strong>매칭도:</strong> {selectedJob.matchScore}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 생성된 자기소개서 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">맞춤형 자기소개서</h3>
                  <Card className="h-[500px]">
                    <CardContent className="p-4 h-full">
                      <div className="h-full overflow-y-auto bg-gray-50 p-4 rounded-md">
                        <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
                          {step4CoverLetter || "자기소개서를 생성 중입니다..."}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 챗봇 상담 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">AI 상담</h3>
                  <Card className="h-[500px]">
                    <CardContent className="flex flex-col h-full p-4">
                      <div className="flex-1 overflow-y-auto space-y-4 mb-4 bg-gray-50 p-3 rounded-md">
                        {chatMessages.map((message, index) => (
                            <div
                            key={index}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                            style={{ whiteSpace: 'pre-line' }}
                            >
                            
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
                          placeholder="수정하고 싶은 부분을 말씀해주세요..."
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
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case 5:
        // 글자수 계산 함수
        const getCharacterCount = (text: string) => {
          return {
            total: text.length,
            withoutSpaces: text.replace(/\s/g, "").length,
            words: text
              .trim()
              .split(/\s+/)
              .filter((word) => word.length > 0).length,
          }
        }
        const duplicationAnalysis = checkDuplicateExpressions(finalCoverLetter)

        // 자기소개서 평가 함수
        const evaluateCoverLetter = (text: string) => {
          const charCount = getCharacterCount(text)
          const evaluation = {
            length:
              charCount.total >= 800 && charCount.total <= 1500
                ? "적절"
                : charCount.total < 800
                  ? "너무 짧음"
                  : "너무 김",
            structure: text.includes("지원") && text.includes("경험") && text.includes("감사") ? "좋음" : "개선 필요",
            keywords: selectedJob
              ? selectedJob.tags.filter((tag) => text.toLowerCase().includes(tag.toLowerCase())).length
              : 0,
            score: Math.min(
              100,
              Math.max(
                0,
                (charCount.total >= 800 && charCount.total <= 1500 ? 30 : 10) +
                  (text.includes("지원") && text.includes("경험") ? 30 : 10) +
                  (selectedJob
                    ? selectedJob.tags.filter((tag) => text.toLowerCase().includes(tag.toLowerCase())).length * 10
                    : 20) +
                  (charCount.words >= 100 ? 20 : charCount.words * 0.2),
              ),
            ),
          }
          return evaluation
        }

        const charCount = getCharacterCount(finalCoverLetter)
        const evaluation = evaluateCoverLetter(finalCoverLetter)

        return (
          <Card className="w-full min-h-[700px]">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm font-bold">STEP 5</div>
                <Edit3 className="h-6 w-6 text-emerald-600" />
                <span>최종 자기소개서 작성</span>
                {stepStatus.step5 && <CheckCircle className="h-5 w-5 text-green-500" />}
              </CardTitle>
              <CardDescription>전 단계에서 작성한 자기소개서를 최종 수정하여 완성하세요.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 자기소개서 편집 */}
                <div className="space-y-4 ">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">자기소개서 편집</h3>
                    <div className="text-sm text-gray-600 space-x-4">
                      <span>공백포함: {charCount.total}자</span>
                      <span>공백제외: {charCount.withoutSpaces}자</span>
                      
                    </div>
                  </div>
                  <Textarea
                    placeholder="자기소개서를 작성하세요..."
                    value={finalCoverLetter}
                    onChange={(e) => setFinalCoverLetter(e.target.value)}
                    className="min-h-[500px]"
                  />
                  <div className="flex space-x-2">
                      <Button
                      variant="outline"
                      className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                      >
                      <Download className="h-4 w-4 mr-2" />
                      다운로드
                      </Button>
                    </div>
                  
                  </div>
                  

                {/* 자기소개서 평가 */}
                  <div className="space-y-4">
                  <h3 className="font-semibold text-lg">자기소개서 평가</h3>
                  <div className="space-y-3">
                    {analysisResult && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-2">💪 활용할 강점</h4>
                        <p className="text-blue-700 text-sm">{analysisResult.strengths}</p>
                      </div>
                    )}
                    
                    {/* 실시간 평가 */}
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        📊 자기소개서 평가 (점수: {Math.round(evaluation.score)}점)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-600">길이:</span>
                          <span
                            className={`font-medium ${
                              evaluation.length === "적절" ? "text-green-600" : "text-orange-600"
                            }`}
                          >
                            {evaluation.length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-600">구성:</span>
                          <span
                            className={`font-medium ${
                              evaluation.structure === "좋음" ? "text-green-600" : "text-orange-600"
                            }`}
                          >
                            {evaluation.structure}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-600">권장:</span>
                          <span className="font-medium text-gray-700">800-1500자</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-600">키워드:</span>
                          <span className="font-medium text-gray-700">유니크</span>
                        </div>
                        
                      </div>
                    </div>

                    

                    {/* ⭐ [수정됨] 중복 표현 분석 결과 UI */}
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">📝 중복 표현 분석</h4>
                      <div className="flex items-center justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600 text-sm">중복 문장 수:</span>
                        <Badge
                          className={`${
                            duplicationAnalysis.count > 0 ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {duplicationAnalysis.count}개
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-600 text-sm">중복률:</span>
                        <Badge
                          className={`${
                            duplicationAnalysis.percentage > 10 ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {duplicationAnalysis.percentage}%
                        </Badge>
                      </div>
                      {duplicationAnalysis.duplicates.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-medium text-gray-700 mb-2 text-sm">의심되는 중복 표현</h5>
                          <div className="max-h-40 overflow-y-auto space-y-3 bg-white p-3 rounded">
                            {duplicationAnalysis.duplicates.map((group, index) => (
                              <div key={index} className="text-xs text-gray-600 border-l-2 border-orange-300 pl-2">
                                <p className="font-semibold">그룹 {index + 1} (유사도 높음):</p>
                                <ul className="list-disc list-inside">
                                  {group.sentences.map((sentence, sIndex) => (
                                    <li key={sIndex}>"{sentence}"</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {selectedJob && (
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 min-h-[200px]">
                        <h4 className="font-semibold text-purple-800 mb-2">🎯 직무 연관성</h4>
                        <p className="text-purple-700 text-sm">{selectedJob.recommendationReason}</p>
                      </div>
                    )}
                      
                    

                    
                  </div>
                  </div>
                  
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  // 대시보드 모드일 때 대시보드 렌더링
  if (showDashboard) {
    return renderDashboard()
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 진행 상황 헤더 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">취업 준비 가이드</CardTitle>
          <CardDescription className="text-center">5단계로 완성하는 맞춤형 취업 준비 프로세스</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 에메랄드 색상의 Progress 바 */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span className={currentStep === 1 ? "font-semibold text-emerald-600" : ""}>1. 이력서 분석</span>
              <span className={currentStep === 2 ? "font-semibold text-emerald-600" : ""}>2. 맞춤 공고</span>
              <span className={currentStep === 3 ? "font-semibold text-emerald-600" : ""}>3. 직무 선택</span>
              <span className={currentStep === 4 ? "font-semibold text-emerald-600" : ""}>4. AI 상담</span>
              <span className={currentStep === 5 ? "font-semibold text-emerald-600" : ""}>5. 자기소개서</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 현재 단계 렌더링 */}
      {renderStep()}

      {/* 네비게이션 버튼 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between">
            <Button
              onClick={goToPrevStep}
              disabled={currentStep === 1}
              variant="outline"
              className="flex items-center space-x-2 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>이전 단계</span>
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">{currentStep} / 5 단계</p>
              <div className="text-xs text-gray-400">임시: 프론트엔드 테스트용 (개발 완료 후 제거)</div>
            </div>

            {currentStep === 5 ? (
              <Button
                onClick={handleFinalCompletion}
                className="bg-emerald-600 hover:bg-emerald-700 flex items-center space-x-2"
              >
                <span>작성 완료</span>
                <CheckCircle className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={goToNextStep}
                disabled={currentStep === 5}
                className="bg-emerald-600 hover:bg-emerald-700 flex items-center space-x-2"
              >
                <span>다음 단계</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
