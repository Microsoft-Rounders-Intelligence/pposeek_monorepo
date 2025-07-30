
import { apiClient } from './client';

export const resumeApi = {
  analyze: (formData: FormData, token: string) => {
    // 새로 만든 파일 전용 메소드를 사용합니다.
    return apiClient.postMultipart('/resume/upload', formData, {
      token,
    });
  },
};