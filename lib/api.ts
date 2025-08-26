const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-backend.vercel.app'
  : 'http://localhost:8000'

export interface BinningRequest {
  data: number[]
  n_bins: number
  method: 'equal_width' | 'quantile'
  user_id: string
  model_name?: string
}

export interface BinningResult {
  bins: Array<{
    bin_id: number
    min_value: number
    max_value: number
    count: number
    percentage: number
    risk_level: string
  }>
  distribution: {
    bins: string[]
    counts: number[]
    percentages: number[]
  }
  model_id: string
}

class CapprossBinsAPI {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }

  async createBinning(data: BinningRequest): Promise<BinningResult> {
    return this.request('/api/binning/create', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getUserModels(userId: string) {
    return this.request(`/api/binning/models/${userId}`)
  }
}

export const CapprossBinsAPI = new CapprossBinsAPI()