/**
 * Client-Side Binning Integration Component
 * Integrates CSV processing and binning with the existing UI components
 */

'use client'

import { useState, useCallback } from 'react'
import { analyzeCSV, processCSVForBinning, CSVAnalysis, CSVColumn } from './csv-processor'
import { ClientSideBinningEngine, BinningResult, BinConfig } from './client-binning'

interface BinningSettings {
  method: 'optimal' | 'equal_width' | 'equal_frequency'
  maxBins?: number
  minBinSize?: number
  forceMonotonic?: boolean
}

interface ClientBinningIntegrationProps {
  onResults: (results: BinningResult) => void
  onError: (error: string) => void
  onProgress: (progress: { step: string; percentage: number }) => void
}

export function ClientBinningIntegration({
  onResults,
  onError,
  onProgress,
}: ClientBinningIntegrationProps) {
  const [processing, setProcessing] = useState(false)
  const [csvAnalysis, setCsvAnalysis] = useState<CSVAnalysis | null>(null)

  const processFile = useCallback(
    async (
      file: File,
      featureName: string,
      targetName: string,
      settings: BinningSettings
    ) => {
      if (processing) return

      setProcessing(true)
      
      try {
        // Step 1: Analyze the CSV file
        onProgress({ step: 'Analyzing CSV file...', percentage: 10 })
        const analysis = await analyzeCSV(file)
        setCsvAnalysis(analysis)

        // Validate columns exist
        const featureColumn = analysis.columns.find((col: CSVColumn) => col.name === featureName)
        const targetColumn = analysis.columns.find((col: CSVColumn) => col.name === targetName)
        
        if (!featureColumn) {
          throw new Error(`Feature column '${featureName}' not found in CSV`)
        }
        if (!targetColumn) {
          throw new Error(`Target column '${targetName}' not found in CSV`)
        }

        // Step 2: Process data for binning
        onProgress({ step: 'Processing data...', percentage: 30 })
        const processedData = await processCSVForBinning(
          file,
          featureName,
          targetName,
          (progress: number) => {
            onProgress({
              step: 'Processing data...',
              percentage: 30 + (progress * 0.4), // 30% to 70%
            })
          }
        )

        // Step 3: Create binning configuration
        onProgress({ step: 'Performing binning analysis...', percentage: 70 })
        
        const config: BinConfig = {
          mode: settings.method,
          maxBins: settings.maxBins || 10,
          minBins: 2,
          enforceMonotonicity: settings.forceMonotonic || false,
          minPopulation: settings.minBinSize || 100,
          mergeThreshold: 0.05
        }

        // Step 4: Perform binning using static method
        onProgress({ step: 'Calculating binning results...', percentage: 80 })
        const results = await ClientSideBinningEngine.performBinning(
          processedData.feature,
          processedData.target,
          config
        )

        onProgress({ step: 'Complete!', percentage: 100 })
        onResults(results)
      } catch (error) {
        console.error('Client-side binning failed:', error)
        onError(error instanceof Error ? error.message : 'Processing failed')
      } finally {
        setProcessing(false)
      }
    },
    [processing, onResults, onError, onProgress]
  )

  return {
    processFile,
    processing,
    csvAnalysis,
  }
}

// Hook for easier integration
export function useClientBinning() {
  const [results, setResults] = useState<BinningResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<{ step: string; percentage: number }>({
    step: 'Ready',
    percentage: 0,
  })

  const integration = ClientBinningIntegration({
    onResults: setResults,
    onError: setError,
    onProgress: setProgress,
  })

  const reset = useCallback(() => {
    setResults(null)
    setError(null)
    setProgress({ step: 'Ready', percentage: 0 })
  }, [])

  return {
    ...integration,
    results,
    error,
    progress,
    reset,
  }
}
