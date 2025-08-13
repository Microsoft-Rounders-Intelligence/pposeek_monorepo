'use client';

import type React from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from "next/navigation";

import { useAuth } from '@/contexts/auth-context';
import { RegisterData } from '@/lib/api/auth';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { LogoText } from "@/components/ui/logo-text";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// 로그인 폼 유효성 검사 스키마
const loginSchema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
  password: z.string().min(1, { message: "비밀번호를 입력해주세요." }),
});

// 회원가입 폼 유효성 검사 스키마
const registerSchema = z.object({
  email: z.string().email({ message: "올바른 이메일 형식을 입력해주세요." }),
  name: z.string().min(2, { message: "닉네임은 2자 이상이어야 합니다." }),
  password: z.string().min(8, { message: "비밀번호는 8자 이상이어야 합니다." }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다.",
  path: ["confirmPassword"],
});

// --- 로그인 폼 컴포넌트 ---
function LoginForm() {
  const { login, isLoading } = useAuth();
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    await login({ 
      username: values.email, 
      password: values.password,
      sessionName: "Web Browser" // 기본 세션 이름
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="email">이메일</Label>
              <FormControl>
                <Input id="email" type="email" placeholder="이메일을 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="password">비밀번호</Label>
              <FormControl>
                <Input id="password" type="password" placeholder="비밀번호를 입력하세요" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          로그인
        </Button>
      </form>
    </Form>
  );
}

// --- 회원가입 폼 컴포넌트 ---
function RegisterForm() {
  const { register, isLoading } = useAuth();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", name: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    const registerData: RegisterData = {
      email: values.email,
      password: values.password,
      name: values.name,
    };
    await register(registerData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="reg-email">이메일</Label>
              <FormControl>
                <Input id="reg-email" type="email" placeholder="이메일" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="reg-name">닉네임</Label>
              <FormControl>
                <Input id="reg-name" placeholder="닉네임" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="reg-password">비밀번호</Label>
              <FormControl>
                <Input id="reg-password" type="password" placeholder="8자 이상 입력" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="reg-confirm-password">비밀번호 확인</Label>
              <FormControl>
                <Input id="reg-confirm-password" type="password" placeholder="비밀번호 다시 입력" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          회원가입
        </Button>
      </form>
    </Form>
  );
}

// --- 메인 페이지 컴포넌트 ---
export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-left">
          <div className="mb-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ←
            </Button>
          </div>
          <div className="flex justify-center mb-4">
            <LogoText size="lg" />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">로그인</TabsTrigger>
              <TabsTrigger value="register">회원가입</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
