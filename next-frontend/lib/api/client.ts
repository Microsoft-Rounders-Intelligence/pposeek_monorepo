// next-frontend/lib/api/client.ts (최종 수정본)

import { toast } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api'

interface RequestOptions extends RequestInit {
  token?: string
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { token, body, ...fetchOptions } = options
    
    const headers: Record<string, string> = {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(fetchOptions.headers as Record<string, string>),
    }

    // body가 FormData가 아닐 경우에만 Content-Type을 application/json으로 설정합니다.
    if (!(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      ...fetchOptions,
      headers,
      body,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    
    if (!response.ok) {
      const error = await response.text()
      toast({
        title: "오류 발생",
        description: error || "요청 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      })
      throw new Error(error || 'API request failed')
    }

    // 응답이 비어있을 경우를 대비
    const responseBody = await response.text();
    try {
        return JSON.parse(responseBody);
    } catch (e) {
        return responseBody as any;
    }
  }

  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // --- 파일 업로드를 위한 새로운 메소드 ---
  postMultipart<T>(endpoint: string, formData: FormData, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData, // FormData는 JSON.stringify 없이 그대로 전달
    });
  }
  // ------------------------------------

  put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()