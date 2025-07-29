"use client"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import LandingPage from "./landing/page"
import JobAIPlatform from "./dashboard/page"

export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()

  // 사용자가 로그인되어 있으면 대시보드로, 아니면 랜딩 페이지로
  if (user) {
    return <JobAIPlatform />
  }

  return <LandingPage />
}
