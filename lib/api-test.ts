/**
 * API Connection Test Utility for CapprossBins
 * Use this to verify backend connectivity
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://capprossbins-server.onrender.com'

export interface HealthCheckResponse {
  status: string
  version: string
  algorithms?: string
}

export interface ConnectionTestResult {
  success: boolean
  url: string
  response?: HealthCheckResponse
  error?: string
  responseTime?: number
}

export class APIConnectionTester {
  static async testConnection(): Promise<ConnectionTestResult> {
    const startTime = Date.now()
    const testUrl = `${API_BASE_URL}/api/health`

    try {
      console.log(`🔍 Testing connection to: ${testUrl}`)

      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })

      const responseTime = Date.now() - startTime

      if (!response.ok) {
        return {
          success: false,
          url: testUrl,
          error: `HTTP ${response.status}: ${response.statusText}`,
          responseTime
        }
      }

      const data: HealthCheckResponse = await response.json()

      console.log('✅ Backend connection successful:', data)

      return {
        success: true,
        url: testUrl,
        response: data,
        responseTime
      }

    } catch (error) {
      const responseTime = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      console.error('❌ Backend connection failed:', errorMessage)

      return {
        success: false,
        url: testUrl,
        error: errorMessage,
        responseTime
      }
    }
  }

  static async testEndpoints(): Promise<Record<string, ConnectionTestResult>> {
    const endpoints = [
      { name: 'health', path: '/api/health' },
      { name: 'root', path: '/' },
    ]

    const results: Record<string, ConnectionTestResult> = {}

    for (const endpoint of endpoints) {
      const startTime = Date.now()
      const testUrl = `${API_BASE_URL}${endpoint.path}`

      try {
        const response = await fetch(testUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000)
        })

        const responseTime = Date.now() - startTime
        const data = await response.json()

        results[endpoint.name] = {
          success: response.ok,
          url: testUrl,
          response: data,
          responseTime,
          error: response.ok ? undefined : `HTTP ${response.status}`
        }

      } catch (error) {
        const responseTime = Date.now() - startTime
        results[endpoint.name] = {
          success: false,
          url: testUrl,
          error: error instanceof Error ? error.message : 'Unknown error',
          responseTime
        }
      }
    }

    return results
  }

  static displayResults(results: Record<string, ConnectionTestResult>): void {
    console.group('🔍 CapprossBins API Connection Test Results')

    Object.entries(results).forEach(([name, result]) => {
      const status = result.success ? '✅' : '❌'
      const time = result.responseTime ? `${result.responseTime}ms` : 'N/A'

      console.log(`${status} ${name.toUpperCase()}: ${result.url} (${time})`)

      if (result.success && result.response) {
        console.log('  Response:', result.response)
      } else if (result.error) {
        console.error('  Error:', result.error)
      }
    })

    console.groupEnd()
  }
}

// Export for use in components or dev tools
export const testBackendConnection = APIConnectionTester.testConnection
export const testAllEndpoints = APIConnectionTester.testEndpoints

// Auto-run in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Run connection test on page load in development
  setTimeout(async () => {
    const results = await testAllEndpoints()
    APIConnectionTester.displayResults(results)

      // Store results globally for debugging
      ; (window as typeof window & { capprossBinsConnectionTest?: Record<string, ConnectionTestResult> }).capprossBinsConnectionTest = results
  }, 1000)
}
