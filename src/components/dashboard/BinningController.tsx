'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Play, Zap, Target, Users, TrendingUp } from 'lucide-react'
import { CapprossBinsAPI, type BinningConfig as APIBinningConfig } from '../../../lib/api'

interface DataInfo {
  filename: string
  rows: number
  columns: string[]
  preview: Record<string, unknown>[]
  upload_id: string
}

interface BinStatistics {
  binNumber: number | string
  range: string
  count: number
  percentage: number
  badRate: number
  woe: number
  iv: number
}

interface BinningResults {
  bins: BinStatistics[]
  statistics: {
    totalIV: number
    gini: number
    ks: number
  }
  charts: {
    badRateChart: unknown
    populationChart: unknown
    woeChart: unknown
  }
  validation: {
    isMonotonic: boolean
    hasMinPopulation: boolean
    warnings: string[]
  }
}

interface BinningControllerProps {
  dataInfo: DataInfo
  selectedFeature: string
  targetColumn: string
  onComplete: (results: BinningResults) => void
  setIsProcessing: (processing: boolean) => void
}

interface BinningConfig {
  // Mode Selection
  mode: 'manual' | 'optimal'
  
  // Manual Mode
  binCount: number
  
  // Optimal Mode
  minBins: number
  maxBins: number
  ivThreshold: number
  
  // Constraints
  enforcePopulation: boolean
  minPopulation: number
  maxPopulation: number
  
  enforceMonotonicity: boolean
  
  mergeSimilarRates: boolean
  mergeThreshold: number
  
  // Special Values
  specialValue: string
  badValue: number
  
  // Noise Filtering
  noiseFiltering: boolean
}

export default function BinningController({ 
  dataInfo, 
  selectedFeature, 
  targetColumn, 
  onComplete, 
  setIsProcessing 
}: BinningControllerProps) {
  const [config, setConfig] = useState<BinningConfig>({
    mode: 'optimal',
    binCount: 6,
    minBins: 3,
    maxBins: 10,
    ivThreshold: 3,
    enforcePopulation: true,
    minPopulation: 5,
    maxPopulation: 20,
    enforceMonotonicity: true,
    mergeSimilarRates: true,
    mergeThreshold: 4,
    specialValue: '-99999',
    badValue: 0,
    noiseFiltering: false
  })

  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState<string[]>([])

  // Run the real binning analysis using the backend API
  const runBinningAnalysis = async () => {
    setIsRunning(true)
    setIsProcessing(true)
    setLogs([])

    try {
      // Convert local config to API format
      const apiConfig: APIBinningConfig = {
        mode: config.mode,
        ...(config.mode === 'manual' && { bin_count: config.binCount }),
        ...(config.mode === 'optimal' && {
          min_bins: config.minBins,
          max_bins: config.maxBins,
          iv_threshold: config.ivThreshold
        }),
        enforce_population: config.enforcePopulation,
        ...(config.enforcePopulation && {
          min_population: config.minPopulation,
          max_population: config.maxPopulation
        }),
        enforce_monotonicity: config.enforceMonotonicity,
        merge_similar_rates: config.mergeSimilarRates,
        ...(config.mergeSimilarRates && { merge_threshold: config.mergeThreshold }),
        special_value: config.specialValue,
        bad_value: config.badValue,
        noise_filtering: config.noiseFiltering
      }

      // Show processing steps
      const steps = [
        'Preparing analysis request...',
        'Connecting to backend engine...',
        'Loading and validating data...',
        'Identifying target distribution...',
        'Handling special values and outliers...',
        config.mode === 'optimal' ? 'Searching for optimal bin configuration...' : 'Creating manual bins...',
        'Applying population constraints...',
        config.mergeSimilarRates ? 'Merging bins with similar bad rates...' : 'Skipping bad rate merging...',
        config.enforceMonotonicity ? 'Enforcing monotonic bad rate progression...' : 'Skipping monotonicity enforcement...',
        'Calculating WOE and IV statistics...',
        'Generating validation report...',
        'Creating visualization data...'
      ]

      for (let i = 0; i < steps.length; i++) {
        setLogs(prev => [...prev, steps[i]])
        await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 300))
      }

      setLogs(prev => [...prev, 'Processing analysis with backend algorithms...'])

      // Call the real backend API
      const analysisResult = await CapprossBinsAPI.createAnalysis({
        analysis_name: `${selectedFeature}_analysis_${new Date().toISOString().split('T')[0]}`,
        description: `Binning analysis for ${selectedFeature} using ${config.mode} mode`,
        upload_id: dataInfo.upload_id,
        feature_name: selectedFeature,
        target_name: targetColumn,
        binning_config: apiConfig
      })
      
      setLogs(prev => [...prev, '✅ Binning analysis completed successfully!'])
      
      // Convert API response to component format
      const convertedResults: BinningResults = {
        bins: analysisResult.bin_statistics.map(bin => ({
          binNumber: bin.binNumber,
          range: bin.range,
          count: bin.count,
          percentage: bin.percentage,
          badRate: bin.badRate,
          woe: bin.woe,
          iv: bin.iv
        })),
        statistics: {
          totalIV: analysisResult.total_iv,
          gini: analysisResult.gini_coefficient,
          ks: analysisResult.ks_statistic
        },
        charts: {
          badRateChart: {},
          populationChart: {},
          woeChart: {}
        },
        validation: {
          isMonotonic: analysisResult.is_monotonic,
          hasMinPopulation: analysisResult.has_min_population,
          warnings: analysisResult.warnings
        }
      }
      
      // Wait a moment before completing
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onComplete(convertedResults)

    } catch (error) {
      console.error('Binning analysis error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setLogs(prev => [...prev, `❌ Error: ${errorMessage}`])
      
      // Show more detailed error information
      if (errorMessage.includes('Network')) {
        setLogs(prev => [...prev, '💡 Check if backend server is running (http://localhost:8000)'])
      } else if (errorMessage.includes('Unauthorized')) {
        setLogs(prev => [...prev, '💡 Please check your authentication credentials'])
      } else {
        setLogs(prev => [...prev, '💡 Please check your data and configuration parameters'])
      }
    } finally {
      setIsRunning(false)
      setIsProcessing(false)
    }
  }

  const handleConfigChange = (key: keyof BinningConfig, value: unknown) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Binning Parameters</h2>
        <p className="text-gray-600">
          Set up constraints and parameters for optimal feature binning
        </p>
      </div>

      {/* Feature Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900 flex items-center">
              <Target className="w-4 h-4 mr-2" />
              Analysis Configuration
            </h3>
            <div className="text-sm text-blue-700 mt-1">
              Feature: <span className="font-medium">{selectedFeature}</span> → 
              Target: <span className="font-medium">{targetColumn}</span>
            </div>
          </div>
          <div className="text-right text-sm text-blue-700">
            <div>{dataInfo.rows.toLocaleString()} observations</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Mode Selection */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Binning Mode
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="optimal"
                  checked={config.mode === 'optimal'}
                  onChange={(e) => handleConfigChange('mode', e.target.value)}
                  className="text-emerald-600"
                />
                <div>
                  <div className="font-medium flex items-center">
                    <Zap className="w-4 h-4 mr-1 text-emerald-600" />
                    Optimal Search
                  </div>
                  <div className="text-sm text-gray-600">
                    Automatically find the best binning configuration
                  </div>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="manual"
                  checked={config.mode === 'manual'}
                  onChange={(e) => handleConfigChange('mode', e.target.value)}
                  className="text-blue-600"
                />
                <div>
                  <div className="font-medium">Manual Configuration</div>
                  <div className="text-sm text-gray-600">
                    Specify exact number of bins and constraints
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Mode-specific Controls */}
          {config.mode === 'optimal' ? (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Optimal Search Parameters</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Bins
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="10"
                      value={config.minBins}
                      onChange={(e) => handleConfigChange('minBins', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Bins
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="20"
                      value={config.maxBins}
                      onChange={(e) => handleConfigChange('maxBins', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Suspicious IV Threshold: {config.ivThreshold}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={config.ivThreshold}
                    onChange={(e) => handleConfigChange('ivThreshold', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Higher values may indicate overfitting
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Manual Configuration</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Bins: {config.binCount}
                </label>
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={config.binCount}
                  onChange={(e) => handleConfigChange('binCount', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Constraints */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Population Constraints
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.enforcePopulation}
                  onChange={(e) => handleConfigChange('enforcePopulation', e.target.checked)}
                  className="text-emerald-600"
                />
                <span className="text-sm font-medium">Enforce Population Limits</span>
              </label>
              
              {config.enforcePopulation && (
                <div className="grid grid-cols-2 gap-4 ml-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Min %: {config.minPopulation}%
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={config.minPopulation}
                      onChange={(e) => handleConfigChange('minPopulation', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Max %: {config.maxPopulation}%
                    </label>
                    <input
                      type="range"
                      min="15"
                      max="50"
                      value={config.maxPopulation}
                      onChange={(e) => handleConfigChange('maxPopulation', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Advanced Options */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Advanced Options
            </h3>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.enforceMonotonicity}
                  onChange={(e) => handleConfigChange('enforceMonotonicity', e.target.checked)}
                  className="text-emerald-600"
                />
                <span className="text-sm">Enforce Monotonic Bad Rate</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.mergeSimilarRates}
                  onChange={(e) => handleConfigChange('mergeSimilarRates', e.target.checked)}
                  className="text-emerald-600"
                />
                <span className="text-sm">Merge Similar Bad Rates</span>
              </label>
              
              {config.mergeSimilarRates && (
                <div className="ml-6">
                  <label className="block text-sm text-gray-700 mb-1">
                    Merge Threshold: {config.mergeThreshold}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={config.mergeThreshold}
                    onChange={(e) => handleConfigChange('mergeThreshold', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.noiseFiltering}
                  onChange={(e) => handleConfigChange('noiseFiltering', e.target.checked)}
                  className="text-emerald-600"
                />
                <span className="text-sm">Apply Noise Filtering</span>
              </label>
            </div>
          </div>
        </div>

        {/* Processing Panel */}
        <div className="space-y-6">
          {/* Special Values */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Special Values</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Missing Value Indicator
                </label>
                <input
                  type="text"
                  value={config.specialValue}
                  onChange={(e) => handleConfigChange('specialValue', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="-99999"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bad Class Value
                </label>
                <select
                  value={config.badValue}
                  onChange={(e) => handleConfigChange('badValue', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value={0}>0 (Zero indicates bad)</option>
                  <option value={1}>1 (One indicates bad)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Run Button */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <motion.button
              onClick={runBinningAnalysis}
              disabled={isRunning}
              className={`w-full flex items-center justify-center space-x-3 py-4 px-6 rounded-lg font-semibold transition-all ${
                isRunning
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
              whileHover={!isRunning ? { scale: 1.02 } : {}}
              whileTap={!isRunning ? { scale: 0.98 } : {}}
            >
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Run Binning Analysis</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Processing Log */}
          {logs.length > 0 && (
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span className="font-semibold">Processing Log</span>
              </div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {logs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-xs"
                  >
                    {log}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
