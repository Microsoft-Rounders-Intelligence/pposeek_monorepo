"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere, MeshDistortMaterial, Environment } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { ArrowRight, Sparkles, Brain, Target, Users, TrendingUp, Shield, Zap, CheckCircle, Star } from "lucide-react"
import type * as THREE from "three"

// 3D 애니메이션 구체 컴포넌트
function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3
      meshRef.current.rotation.y += 0.01
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <Sphere
      ref={meshRef}
      args={[1, 100, 200]}
      scale={hovered ? 1.1 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <MeshDistortMaterial color="#10B981" attach="material" distort={0.3} speed={2} roughness={0.2} metalness={0.8} />
    </Sphere>
  )
}

// 떠다니는 파티클 컴포넌트
function FloatingParticles() {
  const particlesRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  const particles = Array.from({ length: 50 }, (_, i) => (
    <Sphere
      key={i}
      args={[0.02, 8, 8]}
      position={[(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10]}
    >
      <meshStandardMaterial color="#34D399" emissive="#34D399" emissiveIntensity={0.2} />
    </Sphere>
  ))

  return <group ref={particlesRef}>{particles}</group>
}

export default function LandingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const handleGetStarted = () => {
    setIsLoading(true)
    setTimeout(() => {
      router.push("/login")
    }, 500)
  }

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI 기반 맞춤 추천",
      description: "당신의 스킬과 경험을 분석하여 최적의 채용공고를 추천합니다",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "정확한 매칭",
      description: "95% 이상의 높은 매칭 정확도로 시간을 절약하세요",
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "자소서 AI 컨설팅",
      description: "AI가 자소서를 분석하고 개선점을 제안해드립니다",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "안전한 데이터 관리",
      description: "최고 수준의 보안으로 개인정보를 안전하게 보호합니다",
    },
  ]

  const stats = [
    { number: "50,000+", label: "등록 사용자" },
    { number: "15,000+", label: "채용 공고" },
    { number: "95%", label: "매칭 정확도" },
    { number: "4.9/5", label: "사용자 만족도" },
  ]

  const testimonials = [
    {
      name: "김개발",
      role: "프론트엔드 개발자",
      company: "네이버",
      content: "뽀식이 덕분에 딱 맞는 회사를 찾을 수 있었어요. 정말 만족합니다!",
      rating: 5,
    },
    {
      name: "이디자인",
      role: "UX 디자이너",
      company: "카카오",
      content: "자소서 컨설팅 기능이 정말 유용했습니다. 합격률이 확실히 올랐어요.",
      rating: 5,
    },
    {
      name: "박데이터",
      role: "데이터 사이언티스트",
      company: "삼성전자",
      content: "복잡한 취업 준비 과정을 뽀식이가 체계적으로 도와줘서 스트레스가 많이 줄었습니다.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* 3D Background */}
        <div className="absolute inset-0 w-full h-full">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#34D399" />

            <AnimatedSphere />
            <FloatingParticles />

            <Environment preset="night" />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
          </Canvas>
        </div>

        {/* Overlay Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Badge */}
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              AI 기반 취업 플랫폼
            </Badge>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent">
                스마트한 취업,
                <br />
                <span className="text-emerald-400">뽀식이와 함께</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                인공지능이 당신의 커리어를 분석하고, 최적의 채용공고를 추천합니다.
                <br />더 이상 무작정 지원하지 마세요.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={handleGetStarted}
                disabled={isLoading}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    로딩 중...
                  </div>
                ) : (
                  <>
                    시작하기
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-emerald-400 text-emerald-300 hover:bg-emerald-400/10 px-8 py-4 text-lg rounded-full bg-transparent"
                onClick={() => {
                  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                더 알아보기
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">{stat.number}</div>
                  <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-emerald-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-emerald-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
              왜 뽀식이인가요?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              최첨단 AI 기술과 사용자 중심의 디자인으로 취업 성공률을 높여드립니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-700/50 transition-all duration-300 transform hover:scale-105"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
              어떻게 작동하나요?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">간단한 3단계로 당신의 꿈의 직장을 찾아보세요</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "프로필 등록",
                description: "스킬, 경험, 선호도를 입력하여 AI가 당신을 이해할 수 있도록 도와주세요",
                icon: <Users className="h-8 w-8" />,
              },
              {
                step: "02",
                title: "AI 분석",
                description: "고도화된 AI가 당신의 프로필을 분석하고 최적의 채용공고를 찾아드립니다",
                icon: <Brain className="h-8 w-8" />,
              },
              {
                step: "03",
                title: "성공적인 취업",
                description: "맞춤 추천과 AI 컨설팅으로 합격률을 높이고 꿈의 직장에 입사하세요",
                icon: <TrendingUp className="h-8 w-8" />,
              },
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                  {item.icon}
                </div>
                <div className="text-6xl font-bold text-emerald-500/20 absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 -z-10">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full">
                    <ArrowRight className="h-6 w-6 text-emerald-400 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
              사용자들의 이야기
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">실제 사용자들이 경험한 성공 스토리를 확인해보세요</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">
                        {testimonial.role} • {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-3xl p-12 backdrop-blur-sm border border-emerald-500/30">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
              지금 시작하세요
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              수천 명의 사용자가 이미 경험한 뽀식이와 함께 당신의 커리어를 한 단계 업그레이드하세요
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={handleGetStarted}
                disabled={isLoading}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Zap className="mr-2 h-5 w-5" />
                무료로 시작하기
              </Button>
            </div>

            <div className="flex items-center justify-center mt-8 space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                무료 회원가입
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                즉시 사용 가능
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                언제든 해지 가능
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent mb-4">
              뽀식이
            </h3>
            <p className="text-gray-400 mb-6">AI와 함께하는 스마트한 취업 준비</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <span>© 2024 뽀식이. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
