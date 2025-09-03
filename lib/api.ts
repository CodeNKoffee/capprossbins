const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.cappross.com'
  : 'http://localhost:8000'

// Authentication Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  confirm_password: string
  first_name: string
  last_name: string
  company?: string
  job_title?: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: UserResponse
}

export interface UserResponse {
  id: number
  email: string
  first_name: string
  last_name: string
  full_name: string
  is_active: boolean
  is_verified: boolean
  created_at: string
  company?: string
  job_title?: string
  total_analyses: number
}

// Binning Types
export interface BinningConfig {
  mode: 'optimal' | 'manual'
  bin_count?: number
  min_bins?: number
  max_bins?: number
  iv_threshold?: number
  enforce_population: boolean
  min_population?: number
  max_population?: number
  enforce_monotonicity: boolean
  merge_similar_rates: boolean
  merge_threshold?: number
  special_value?: string
  bad_value: number
  noise_filtering: boolean
}

export interface DataUploadResponse {
  filename: string
  rows: number
  columns: string[]
  preview: Record<string, unknown>[]
  file_size_bytes: number
  upload_id: string
}

export interface BinStatistic {
  binNumber: string | number
  range: string
  count: number
  percentage: number
  badRate: number
  woe: number
  iv: number
}

export interface AnalysisResponse {
  id: number
  name: string
  description?: string
  feature_name: string
  target_name: string
  original_filename: string
  total_bins: number
  total_iv: number
  gini_coefficient: number
  ks_statistic: number
  is_monotonic: boolean
  has_min_population: boolean
  warning_count: number
  warnings: string[]
  bin_statistics: BinStatistic[]
  charts_data?: unknown
  processing_time_seconds?: number
  status: string
  created_at: string
}

export interface AnalysisSummary {
  id: number
  name: string
  feature_name: string
  target_name: string
  total_bins: number
  total_iv: number
  gini_coefficient: number
  is_monotonic: boolean
  warning_count: number
  status: string
  created_at: string
}

class CapprossBinsAPIClass {
  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const defaultHeaders = endpoint.startsWith('/api/auth/') && !endpoint.includes('/me')
      ? { 'Content-Type': 'application/json' }
      : this.getAuthHeaders()

    const response = await fetch(url, {
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }))
      throw new Error(errorData.detail || errorData.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Authentication endpoints
  async login(credentials: LoginRequest): Promise<TokenResponse> {
    const result = await this.request<TokenResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    // Store tokens
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', result.access_token)
      localStorage.setItem('refresh_token', result.refresh_token)
      localStorage.setItem('user', JSON.stringify(result.user))
    }

    return result
  }

  async register(userData: RegisterRequest): Promise<TokenResponse> {
    const result = await this.request<TokenResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    // Store tokens
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', result.access_token)
      localStorage.setItem('refresh_token', result.refresh_token)
      localStorage.setItem('user', JSON.stringify(result.user))
    }

    return result
  }

  async logout(): Promise<void> {
    try {
      await this.request('/api/auth/logout', { method: 'POST' })
    } finally {
      // Always clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
      }
    }
  }

  async getCurrentUser(): Promise<UserResponse> {
    return this.request<UserResponse>('/api/auth/me')
  }

  async refreshToken(): Promise<{ access_token: string; expires_in: number }> {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const result = await this.request<{ access_token: string; expires_in: number }>('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    // Update stored access token
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', result.access_token)
    }

    return result
  }

  // Data upload and analysis endpoints
  async uploadData(file: File): Promise<DataUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

    const response = await fetch(`${API_BASE_URL}/api/binning/upload-data`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }))
      throw new Error(errorData.detail || errorData.error || 'Upload failed')
    }

    return response.json()
  }

  async createAnalysis(analysisData: {
    analysis_name: string
    description?: string
    upload_id: string
    feature_name: string
    target_name: string
    binning_config: BinningConfig
  }): Promise<AnalysisResponse> {
    const formData = new FormData()
    formData.append('analysis_name', analysisData.analysis_name)
    if (analysisData.description) {
      formData.append('description', analysisData.description)
    }
    formData.append('upload_id', analysisData.upload_id)
    formData.append('feature_name', analysisData.feature_name)
    formData.append('target_name', analysisData.target_name)
    formData.append('binning_config', JSON.stringify(analysisData.binning_config))

    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

    const response = await fetch(`${API_BASE_URL}/api/binning/analyze`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Analysis failed' }))
      throw new Error(errorData.detail || errorData.error || 'Analysis failed')
    }

    return response.json()
  }

  async getUserAnalyses(params: {
    skip?: number
    limit?: number
    status_filter?: string
    sort_by?: string
    sort_order?: string
  } = {}): Promise<AnalysisSummary[]> {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })

    const queryString = searchParams.toString()
    const endpoint = `/api/binning/analyses${queryString ? `?${queryString}` : ''}`

    return this.request<AnalysisSummary[]>(endpoint)
  }

  async getAnalysisDetails(analysisId: number): Promise<AnalysisResponse> {
    return this.request<AnalysisResponse>(`/api/binning/analyses/${analysisId}`)
  }

  async deleteAnalysis(analysisId: number): Promise<{ message: string }> {
    return this.request(`/api/binning/analyses/${analysisId}`, {
      method: 'DELETE'
    })
  }

  async exportAnalysis(analysisId: number, format: 'csv' | 'pdf' | 'excel'): Promise<{
    download_url: string
    filename: string
    content_type: string
    file_size: number
  }> {
    return this.request(`/api/binning/analyses/${analysisId}/export`, {
      method: 'POST',
      body: JSON.stringify({
        format,
        include_charts: true,
        include_statistics: true
      })
    })
  }

  // User dashboard endpoints
  async getDashboardStats(): Promise<unknown> {
    return this.request('/api/users/dashboard-stats')
  }

  async getRecentAnalyses(limit: number = 5): Promise<AnalysisSummary[]> {
    return this.request(`/api/users/recent-analyses?limit=${limit}`)
  }
}

export const CapprossBinsAPI = new CapprossBinsAPIClass()