"use client"

import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  const leafSizes = {
    sm: { main: "w-4 h-5", small: "w-2 h-3" },
    md: { main: "w-5 h-6", small: "w-3 h-4" },
    lg: { main: "w-6 h-7", small: "w-3 h-4" },
  }

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
      {/* 배경 원 - 자연스러운 그라데이션 */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 via-green-400 to-teal-500 shadow-lg opacity-90"></div>

      {/* 내부 원 - 더 밝은 자연색 */}
      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-emerald-200 via-green-200 to-teal-300 opacity-80"></div>

      {/* 메인 잎사귀 */}
      <div className={cn("absolute z-10 transform -rotate-12 origin-bottom", leafSizes[size].main)}>
        <div className="w-full h-full bg-gradient-to-t from-emerald-600 via-emerald-500 to-emerald-400 rounded-full transform skew-y-12 shadow-sm"></div>
      </div>

      {/* 작은 잎사귀 */}
      <div className={cn("absolute z-10 transform rotate-45 translate-x-1 -translate-y-1", leafSizes[size].small)}>
        <div className="w-full h-full bg-gradient-to-t from-green-600 via-green-500 to-green-400 rounded-full transform skew-y-6 shadow-sm opacity-80"></div>
      </div>

      {/* 줄기 */}
      <div className="absolute z-10 w-0.5 h-3 bg-gradient-to-b from-emerald-600 to-emerald-700 transform translate-y-1 rounded-full"></div>

      {/* 자연스러운 하이라이트 */}
      <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 bg-white rounded-full opacity-40 blur-sm"></div>
      <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full opacity-60"></div>
    </div>
  )
}
