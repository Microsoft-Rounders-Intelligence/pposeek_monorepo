"use client"

import { cn } from "@/lib/utils"
import { Logo } from "./logo"

interface LogoTextProps {
  className?: string
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
}

export function LogoText({ className, size = "md", showIcon = true }: LogoTextProps) {
  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  const logoSizes = {
    sm: "sm" as const,
    md: "md" as const,
    lg: "lg" as const,
  }

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      {showIcon && <Logo size={logoSizes[size]} />}
     
    </div>
  )
}
