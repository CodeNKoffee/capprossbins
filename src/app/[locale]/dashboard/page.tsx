'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Database, Settings, BarChart3, Download, History } from 'lucide-react'
import DataUploader from '@/components/dashboard/DataUploader'
import FeatureSelector from '@/components/dashboard/FeatureSelector'
import BinningController from '@/components/dashboard/BinningController'
import ResultsDashboard from '@/components/dashboard/ResultsDashboard'
import AnalysisHistory from '@/components/dashboard/AnalysisHistory'

interface SavedAnalysis {
  id: string
  name: string
  featureName: string
  targetName: string
  createdAt: Date
  totalIV: number
  gini: number
  binCount: number
  isMonotonic: boolean
  hasWarnings: boolean
  results: BinningResults
}

type DashboardStep = 'upload' | 'feature' | 'binning' | 'results' | 'history'

interface DataInfo {
  filename: string
  rows: number
  columns: string[]
  preview: Record<string, unknown>[]
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

export default function DashboardPage() {
  const [currentStep, setCurrentStep] = useState<DashboardStep>('upload')
  const [dataInfo, setDataInfo] = useState<DataInfo | null>(null)
  const [selectedFeature, setSelectedFeature] = useState<string>('')
  const [targetColumn, setTargetColumn] = useState<string>('')
  const [binningResults, setBinningResults] = useState<BinningResults | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const steps = [
    { id: 'upload', label: 'Upload Data', icon: Upload, description: 'Import your credit data CSV file' },
    { id: 'feature', label: 'Select Features', icon: Database, description: 'Choose feature and target columns' },
    { id: 'binning', label: 'Configure Binning', icon: Settings, description: 'Set binning parameters and constraints' },
    { id: 'results', label: 'View Results', icon: BarChart3, description: 'Analyze binning results and statistics' },
    { id: 'history', label: 'Analysis History', icon: History, description: 'View past analyses' }
  ]

  const handleDataUpload = (data: DataInfo) => {
    setDataInfo(data)
    setCurrentStep('feature')
  }

  const handleFeatureSelection = (feature: string, target: string) => {
    setSelectedFeature(feature)
    setTargetColumn(target)
    setCurrentStep('binning')
  }

  const handleBinningComplete = (results: BinningResults) => {
    setBinningResults(results)
    setCurrentStep('results')
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return <DataUploader onUpload={handleDataUpload} />
      case 'feature':
        return (
          <FeatureSelector
            dataInfo={dataInfo!}
            onFeatureSelect={handleFeatureSelection}
          />
        )
      case 'binning':
        return (
          <BinningController
            dataInfo={dataInfo!}
            selectedFeature={selectedFeature}
            targetColumn={targetColumn}
            onComplete={handleBinningComplete}
            setIsProcessing={setIsProcessing}
          />
        )
      case 'results':
        return (
          <ResultsDashboard
            results={binningResults!}
            featureName={selectedFeature}
            onSave={() => {
              // Save analysis to history
              console.log('Saving analysis...')
            }}
            onExport={() => {
              // Export analysis
              console.log('Exporting analysis...')
            }}
          />
        )
      case 'history':
        return (
          <AnalysisHistory 
            onLoadAnalysis={(analysis: SavedAnalysis) => {
              // Load previous analysis
              console.log('Loading analysis:', analysis)
            }}
            onNewAnalysis={() => {
              setCurrentStep('upload')
            }}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <motion.h1 
                className="text-2xl font-bold text-gray-900"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                CapprossBins Dashboard
              </motion.h1>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2 inline" />
                Export
              </motion.button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <nav className="flex items-center justify-center">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index
              
              return (
                <div key={step.id} className="flex items-center">
                  <motion.button
                    onClick={() => {
                      // Allow navigation back to completed steps
                      if (isCompleted || isActive) {
                        setCurrentStep(step.id as DashboardStep)
                      }
                    }}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                        : isCompleted
                        ? 'bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                    whileHover={isCompleted || isActive ? { scale: 1.02 } : {}}
                    disabled={!isCompleted && !isActive}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    <div className="text-left">
                      <div className="font-medium text-sm">{step.label}</div>
                      <div className="text-xs opacity-75 hidden sm:block">{step.description}</div>
                    </div>
                  </motion.button>
                  
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-300' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 min-h-[600px]"
        >
          {isProcessing && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 rounded-xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Processing your data...</p>
              </div>
            </div>
          )}
          
          <div className="p-6">
            {renderStepContent()}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
