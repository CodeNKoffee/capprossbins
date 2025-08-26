import { useState } from 'react'
import { CapprossBinsAPI, BinningRequest, BinningResult } from '../lib/api'

export function useBinning() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<BinningResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const createBinning = async (request: BinningRequest) => {
    setLoading(true)
    setError(null)

    try {
      const result = await CapprossBinsAPI.createBinning(request)
      setResult(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    createBinning,
    result,
    loading,
    error,
    clearResult: () => setResult(null),
    clearError: () => setError(null)
  }
}