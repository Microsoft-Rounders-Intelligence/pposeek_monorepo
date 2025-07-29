import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { Footer } from "@/components/ui/footer"  // Footer import 추가

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "취업 AI 플랫폼",
  description: "AI와 함께하는 스마트한 취업 준비",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <AuthProvider>
          <main className="flex-1">
            {children}
          </main>
          <Footer />  {/* Footer 추가 */}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}