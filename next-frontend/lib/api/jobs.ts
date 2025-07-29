import { apiClient } from './client'

export interface CompanyInfo {
  name: string
  size: string
  industry: string
  description: string
  logo: string
}

export interface Job {
  id: number
  title: string
  company: string
  location: string
  salary: string
  employmentType: string
  experience: string
  education: string
  tags: string[]
  postedDate: string
  deadline: string
  matchScore: number
  description: string
  requirements: string[]
  benefits: string[]
  companyInfo: CompanyInfo
}

export interface JobsResponse {
  content: Job[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export interface JobsParams {
  search?: string
  tags?: string[]
  location?: string
  employmentType?: string
  page?: number
  size?: number
}

export const jobsApi = {
  getJobs: (params: JobsParams) => {
    const queryParams = new URLSearchParams()
    if (params.search) queryParams.append('search', params.search)
    if (params.tags?.length) params.tags.forEach(tag => queryParams.append('tags', tag))
    if (params.location) queryParams.append('location', params.location)
    if (params.employmentType) queryParams.append('employmentType', params.employmentType)
    if (params.page !== undefined) queryParams.append('page', params.page.toString())
    if (params.size !== undefined) queryParams.append('size', params.size.toString())
    
    return apiClient.get<JobsResponse>(`/jobs?${queryParams}`)
  },
  
  getJobById: (id: number) => 
    apiClient.get<Job>(`/jobs/${id}`),
    
  getRecommendedJobs: (token: string) => 
    apiClient.get<Job[]>('/jobs/recommended', { token }),
    
  applyToJob: (id: number, token: string) => 
    apiClient.post<void>(`/jobs/${id}/apply`, undefined, { token }),
    
  bookmarkJob: (id: number, token: string) => 
    apiClient.post<void>(`/jobs/${id}/bookmark`, undefined, { token }),
}
