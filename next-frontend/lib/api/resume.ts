import { apiClient } from './client';

export const resumeApi = {
  analyze: (formData: FormData, token: string) => {
    return apiClient.post('/resume/upload', formData, {
      token,
      headers: {
        
      },
    });
  },
};