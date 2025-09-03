import { useState } from 'react'
import { CapprossBinsAPI, AnalysisResponse, BinningConfig, DataUploadResponse } from '../lib/api'

export function useBinning() {
  const [loading, setLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResponse | null>(null)
  const [uploadResult, setUploadResult] = useState<DataUploadResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const uploadData = async (file: File) => {
    setUploadLoading(true)
    setError(null)

    try {
      const result = await CapprossBinsAPI.uploadData(file)
      setUploadResult(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      setError(errorMessage)
      throw err
    } finally {
      setUploadLoading(false)
    }
  }

  const createBinning = async (analysisData: {
    analysis_name: string
    description?: string
    upload_id: string
    feature_name: string
    target_name: string
    binning_config: BinningConfig
  }) => {
    setLoading(true)
    setError(null)

    try {
      const result = await CapprossBinsAPI.createAnalysis(analysisData)
      setResult(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getUserAnalyses = async (params?: {
    skip?: number
    limit?: number
    status_filter?: string
    sort_by?: string
    sort_order?: string
  }) => {
    try {
      return await CapprossBinsAPI.getUserAnalyses(params)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analyses'
      setError(errorMessage)
      throw err
    }
  }

  const getAnalysisDetails = async (analysisId: number) => {
    setLoading(true)
    setError(null)

    try {
      const result = await CapprossBinsAPI.getAnalysisDetails(analysisId)
      setResult(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch analysis details'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteAnalysis = async (analysisId: number) => {
    try {
      return await CapprossBinsAPI.deleteAnalysis(analysisId)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete analysis'
      setError(errorMessage)
      throw err
    }
  }

  const exportAnalysis = async (analysisId: number, format: 'csv' | 'pdf' | 'excel') => {
    try {
      const result = await CapprossBinsAPI.exportAnalysis(analysisId, format)

      // Trigger download
      const link = document.createElement('a')
      link.href = `http://localhost:8000${result.download_url}`
      link.download = result.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Export failed'
      setError(errorMessage)
      throw err
    }
  }

  return {
    // Data upload
    uploadData,
    uploadResult,
    uploadLoading,

    // Analysis creation and management
    createBinning,
    getUserAnalyses,
    getAnalysisDetails,
    deleteAnalysis,
    exportAnalysis,

    // State
    result,
    loading,
    error,

    // Utility functions
    clearResult: () => setResult(null),
    clearError: () => setError(null),
    clearUploadResult: () => setUploadResult(null)
  }
}