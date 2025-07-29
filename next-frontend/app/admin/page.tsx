"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/layout/header"
import {
  Users,
  Briefcase,
  TrendingUp,
  Activity,
  Server,
  Cpu,
  HardDrive,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface SystemMetrics {
  cpu: number
  memory: number
  disk: number
  network: number
}

interface ServiceStatus {
  name: string
  status: "healthy" | "warning" | "error"
  uptime: string
  lastCheck: string
}

export default function AdminPage() {
  const { user, hasPermission } = useAuth()
  const router = useRouter()
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 67,
    disk: 23,
    network: 89,
  })
  const [services, setServices] = useState<ServiceStatus[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (!hasPermission("view_analytics")) {
      router.push("/")
      return
    }

    // Mock services data
    const mockServices: ServiceStatus[] = [
      {
        name: "Spring Server (BFF)",
        status: "healthy",
        uptime: "99.9%",
        lastCheck: "2분 전",
      },
      {
        name: "AI Server",
        status: "healthy",
        uptime: "99.7%",
        lastCheck: "1분 전",
      },
      {
        name: "User Database",
        status: "warning",
        uptime: "98.5%",
        lastCheck: "3분 전",
      },
      {
        name: "Job Database",
        status: "healthy",
        uptime: "99.8%",
        lastCheck: "2분 전",
      },
      {
        name: "ETL Pipeline",
        status: "healthy",
        uptime: "97.2%",
        lastCheck: "5분 전",
      },
      {
        name: "ELK Stack",
        status: "error",
        uptime: "95.1%",
        lastCheck: "10분 전",
      },
    ]

    setServices(mockServices)

    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        disk: Math.floor(Math.random() * 100),
        network: Math.floor(Math.random() * 100),
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [user, router, hasPermission])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-emerald-100 text-emerald-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMetricColor = (value: number) => {
    if (value < 50) return "text-emerald-600"
    if (value < 80) return "text-yellow-600"
    return "text-red-600"
  }

  if (!user || !hasPermission("view_analytics")) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-gray-600">시스템 상태 및 사용자 현황을 모니터링하세요</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                <Activity className="h-3 w-3 mr-1" />
                시스템 정상
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">개요</TabsTrigger>
              <TabsTrigger value="users">사용자 관리</TabsTrigger>
              <TabsTrigger value="jobs">채용공고 관리</TabsTrigger>
              <TabsTrigger value="system">시스템 모니터링</TabsTrigger>
              <TabsTrigger value="logs">로그 분석</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">총 사용자</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12,847</div>
                    <p className="text-xs text-muted-foreground">+180 이번 주</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">활성 채용공고</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,234</div>
                    <p className="text-xs text-muted-foreground">+23 오늘</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">AI 상담 세션</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8,921</div>
                    <p className="text-xs text-muted-foreground">+12% 이번 달</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">매칭 성공률</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">87.3%</div>
                    <p className="text-xs text-muted-foreground">+2.1% 지난 주</p>
                  </CardContent>
                </Card>
              </div>

              {/* System Health */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>시스템 리소스</CardTitle>
                    <CardDescription>실시간 시스템 사용률</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Cpu className="h-4 w-4" />
                        <span className="text-sm">CPU</span>
                      </div>
                      <span className={`text-sm font-medium ${getMetricColor(metrics.cpu)}`}>{metrics.cpu}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${metrics.cpu < 50 ? "bg-emerald-500" : metrics.cpu < 80 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{ width: `${metrics.cpu}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Server className="h-4 w-4" />
                        <span className="text-sm">메모리</span>
                      </div>
                      <span className={`text-sm font-medium ${getMetricColor(metrics.memory)}`}>{metrics.memory}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${metrics.memory < 50 ? "bg-emerald-500" : metrics.memory < 80 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{ width: `${metrics.memory}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <HardDrive className="h-4 w-4" />
                        <span className="text-sm">디스크</span>
                      </div>
                      <span className={`text-sm font-medium ${getMetricColor(metrics.disk)}`}>{metrics.disk}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${metrics.disk < 50 ? "bg-emerald-500" : metrics.disk < 80 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{ width: `${metrics.disk}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>서비스 상태</CardTitle>
                    <CardDescription>각 마이크로서비스 상태</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {services.map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(service.status)}
                            <div>
                              <p className="font-medium text-sm">{service.name}</p>
                              <p className="text-xs text-gray-500">가동률: {service.uptime}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                            <p className="text-xs text-gray-500 mt-1">{service.lastCheck}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Management */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>사용자 관리</CardTitle>
                  <CardDescription>등록된 사용자 현황 및 관리</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <h3 className="font-medium">사용자 통계</h3>
                        <p className="text-sm text-gray-500">전체 사용자 현황</p>
                      </div>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">사용자 추가</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">8,234</div>
                        <div className="text-sm text-gray-600">일반 사용자</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-emerald-600">156</div>
                        <div className="text-sm text-gray-600">HR 사용자</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">12</div>
                        <div className="text-sm text-gray-600">관리자</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Jobs Management */}
            <TabsContent value="jobs">
              <Card>
                <CardHeader>
                  <CardTitle>채용공고 관리</CardTitle>
                  <CardDescription>채용공고 현황 및 승인 관리</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">1,234</div>
                        <div className="text-sm text-gray-600">활성 공고</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">89</div>
                        <div className="text-sm text-gray-600">승인 대기</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-emerald-600">456</div>
                        <div className="text-sm text-gray-600">이번 주 신규</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-red-600">23</div>
                        <div className="text-sm text-gray-600">신고된 공고</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Monitoring */}
            <TabsContent value="system">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>네트워크 상태</CardTitle>
                    <CardDescription>클라우드 인프라 상태</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Virtual Network</span>
                        <Badge className="bg-emerald-100 text-emerald-800">정상</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Load Balancer</span>
                        <Badge className="bg-emerald-100 text-emerald-800">정상</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>CDN</span>
                        <Badge className="bg-yellow-100 text-yellow-800">경고</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>DNS</span>
                        <Badge className="bg-emerald-100 text-emerald-800">정상</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>보안 상태</CardTitle>
                    <CardDescription>보안 시스템 모니터링</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Key Vault</span>
                        <Badge className="bg-emerald-100 text-emerald-800">안전</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Private Endpoint</span>
                        <Badge className="bg-emerald-100 text-emerald-800">안전</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>RSG Rules</span>
                        <Badge className="bg-emerald-100 text-emerald-800">활성</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>SSL 인증서</span>
                        <Badge className="bg-yellow-100 text-yellow-800">만료 임박</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Logs Analysis */}
            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle>로그 분석</CardTitle>
                  <CardDescription>ELK Stack을 통한 로그 모니터링</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">45,678</div>
                        <div className="text-sm text-gray-600">오늘 총 요청</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-red-600">23</div>
                        <div className="text-sm text-gray-600">에러 발생</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-emerald-600">99.95%</div>
                        <div className="text-sm text-gray-600">성공률</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">최근 로그</h4>
                      <div className="space-y-1 text-sm font-mono bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                        <div className="text-emerald-600">
                          [INFO] 2024-01-20 14:30:15 - User login successful: user@test.com
                        </div>
                        <div className="text-blue-600">[INFO] 2024-01-20 14:29:45 - AI chat session started</div>
                        <div className="text-yellow-600">
                          [WARN] 2024-01-20 14:28:30 - High memory usage detected: 85%
                        </div>
                        <div className="text-emerald-600">
                          [INFO] 2024-01-20 14:27:12 - Job application submitted successfully
                        </div>
                        <div className="text-red-600">[ERROR] 2024-01-20 14:25:08 - Database connection timeout</div>
                        <div className="text-emerald-600">
                          [INFO] 2024-01-20 14:24:55 - ETL pipeline completed successfully
                        </div>
                      </div>
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
