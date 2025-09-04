const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://capprossbins-server.onrender.com'
    : 'http://localhost:8000')

// Enhanced Error Types
export interface APIError extends Error {
  statusCode?: number
  retryable?: boolean
  suggestedAction?: string
  type?: 'NETWORK' | 'SERVER' | 'TIMEOUT' | 'SIZE_LIMIT' | 'GATEWAY' | 'AUTH' | 'UNKNOWN'
}

export class APIErrorHandler {
  static createError(message: string, statusCode?: number, response?: Response): APIError {
    const error = new Error(message) as APIError
    error.statusCode = statusCode

    // Analyze error type and provide suggestions
    if (statusCode === 502) {
      error.type = 'GATEWAY'
      error.retryable = true
      error.suggestedAction = 'Server temporarily unavailable. The service may be starting up or overloaded. Try again in 30-60 seconds.'
    } else if (statusCode === 504) {
      error.type = 'TIMEOUT'  
      error.retryable = true
      error.suggestedAction = 'Request timed out. Try with a smaller file or retry later.'
    } else if (statusCode === 413) {
      error.type = 'SIZE_LIMIT'
      error.retryable = false
      error.suggestedAction = 'File too large. Reduce file size to under 50MB.'
    } else if (statusCode === 429) {
      error.type = 'SERVER'
      error.retryable = true
      error.suggestedAction = 'Too many requests. Wait a moment before trying again.'
    } else if (statusCode && statusCode >= 500) {
      error.type = 'SERVER'
      error.retryable = true
      error.suggestedAction = 'Server error. Try again in a few minutes.'
    } else if (statusCode === 401 || statusCode === 403) {
      error.type = 'AUTH'
      error.retryable = false
      error.suggestedAction = 'Authentication required. Please log in again.'
    } else if (!statusCode || message.includes('fetch')) {
      error.type = 'NETWORK'
      error.retryable = true
      error.suggestedAction = 'Network error. Check your internet connection.'
    } else {
      error.type = 'UNKNOWN'
      error.retryable = true
    }

    return error
  }
}

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

    try {
      const response = await fetch(url, {
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: response.status === 502 
            ? 'Server temporarily unavailable (502 Bad Gateway)' 
            : 'Network error' 
        }))
        
        const errorMessage = errorData.detail || errorData.error || `HTTP ${response.status}`
        throw APIErrorHandler.createError(errorMessage, response.status, response)
      }

      return response.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        // Network connectivity issues
        throw APIErrorHandler.createError('Network connection failed. Check your internet connection.', undefined)
      }
      
      // Re-throw APIError instances
      if ((error as APIError).type) {
        throw error
      }
      
      // Handle other errors
      const message = error instanceof Error ? error.message : 'Unknown error occurred'
      throw APIErrorHandler.createError(message)
    }
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
  // Simple upload method with retry logic for 502 errors
  async uploadData(file: File): Promise<DataUploadResponse> {
    return this.uploadDataWithRetry(file, 3) // 3 attempts for 502 errors
  }

  // Upload with automatic retry for 502 errors
  async uploadDataWithRetry(
    file: File, 
    maxRetries: number = 3,
    onProgress?: (progress: number) => void
  ): Promise<DataUploadResponse> {
    let lastError: Error | undefined

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🚀 Upload attempt ${attempt}/${maxRetries} for file: ${file.name}`)
        
        const result = await this.uploadDataWithProgress(file, onProgress)
        console.log('✅ Upload successful!')
        return result
        
      } catch (error) {
        lastError = error as Error
        const apiError = error as APIError
        
        // Only retry for 502 (Bad Gateway) errors or network issues
        const isRetryable = apiError.statusCode === 502 || 
                           apiError.type === 'NETWORK' || 
                           apiError.type === 'GATEWAY' ||
                           (apiError.statusCode === undefined && apiError.message?.includes('fetch'))

        console.log(`❌ Upload attempt ${attempt} failed:`, lastError.message)
        
        if (!isRetryable || attempt === maxRetries) {
          console.log('🚫 Error not retryable or max attempts reached')
          break
        }

        // Wait before retry (exponential backoff)
        const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 30000) // Cap at 30 seconds
        console.log(`⏳ Waiting ${waitTime / 1000} seconds before retry...`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }

    // If we get here, all attempts failed
    throw lastError || new Error('Upload failed after multiple attempts')
  }

  // Enhanced upload with progress tracking
  async uploadDataWithProgress(
    file: File,
    onProgress?: (progress: number) => void,
    timeoutMs: number = 300000 // 5 minutes
  ): Promise<DataUploadResponse> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const formData = new FormData()
      formData.append('file', file)

      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

      // Set timeout
      xhr.timeout = timeoutMs

      // Handle progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100
            onProgress(Math.round(percentComplete))
          }
        })
      }

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch {
            reject(APIErrorHandler.createError('Invalid response format', xhr.status))
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText)
            const message = errorData.detail || errorData.error || `Upload failed: HTTP ${xhr.status}`
            reject(APIErrorHandler.createError(message, xhr.status))
          } catch {
            let message = `Upload failed: HTTP ${xhr.status}`
            if (xhr.status === 502) {
              message = 'Server temporarily unavailable (502 Bad Gateway). The server may be starting up or overloaded.'
            } else if (xhr.status === 504) {
              message = 'Upload timed out (504 Gateway Timeout). Try with a smaller file.'
            }
            reject(APIErrorHandler.createError(message, xhr.status))
          }
        }
      })

      // Handle errors
      xhr.addEventListener('error', () => {
        reject(APIErrorHandler.createError('Network error: Please check your connection and try again'))
      })

      xhr.addEventListener('timeout', () => {
        reject(APIErrorHandler.createError(`Upload timeout: File upload took longer than ${timeoutMs / 1000} seconds`, 504))
      })

      xhr.addEventListener('abort', () => {
        reject(APIErrorHandler.createError('Upload was cancelled'))
      })

      // Open and send request
      xhr.open('POST', `${API_BASE_URL}/api/binning/upload-data`)
      
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }

      xhr.send(formData)
    })
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