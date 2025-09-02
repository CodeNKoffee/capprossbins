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
          className="bg-white rounded-xl shadow-lg border border-gray-200 min-h-[600px] relative"
        >
          <div className="p-6">
            {renderStepContent()}
          </div>
        </motion.div>
      </div>

      {/* Full Screen Glass Loading Overlay */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center glass-overlay"
        >
          {/* Loading Content */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 20 }}
            className="relative z-10 glass-strong rounded-3xl p-10 shadow-2xl max-w-md mx-4 float-animation"
          >
            <div className="text-center">
              {/* Animated Loading Spinner */}
              <div className="relative mb-8">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-emerald-200/60 border-t-emerald-500 mx-auto"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-100/30 to-blue-100/30 animate-pulse loading-pulse"></div>
                {/* Inner glow effect */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-emerald-50/50 to-transparent animate-spin" style={{ animationDuration: '3s' }}></div>
              </div>
              
              {/* Loading Text */}
              <motion.h3 
                className="text-2xl font-bold text-gray-800 mb-3"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Processing Analysis
              </motion.h3>
              <p className="text-gray-700 mb-6 text-lg">
                Running binning algorithms and calculating statistics...
              </p>
              
              {/* Progress Dots */}
              <div className="flex justify-center space-x-3">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-lg"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.4, 1, 0.4],
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
              
              {/* Additional visual elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-emerald-400/30 to-green-400/30 rounded-full animate-pulse"></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
