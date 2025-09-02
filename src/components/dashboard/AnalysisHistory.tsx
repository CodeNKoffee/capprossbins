'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  History, 
  Download, 
  Trash2, 
  Eye, 
  BarChart3,
  FileText,
  Search,
  Plus,
  Archive
} from 'lucide-react'

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
  results: {
    bins: Array<{
      binNumber: number | string
      range: string
      count: number
      percentage: number
      badRate: number
      woe: number
      iv: number
    }>
    statistics: {
      totalIV: number
      gini: number
      ks: number
    }
    validation: {
      isMonotonic: boolean
      hasMinPopulation: boolean
      warnings: string[]
    }
  }
}

interface AnalysisHistoryProps {
  onLoadAnalysis: (analysis: SavedAnalysis) => void
  onNewAnalysis: () => void
}

export default function AnalysisHistory({ onLoadAnalysis, onNewAnalysis }: AnalysisHistoryProps) {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'iv'>('date')
  const [selectedAnalysis, setSelectedAnalysis] = useState<SavedAnalysis | null>(null)

  // Load saved analyses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('binning_analyses')
    if (saved) {
      try {
        const parsedAnalyses = JSON.parse(saved).map((analysis: SavedAnalysis & { createdAt: string }) => ({
          ...analysis,
          createdAt: new Date(analysis.createdAt)
        }))
        setAnalyses(parsedAnalyses)
      } catch (error) {
        console.error('Error loading saved analyses:', error)
      }
    } else {
      // Add some sample analyses for demonstration
      const sampleAnalyses: SavedAnalysis[] = [
        {
          id: '1',
          name: 'Credit Score Analysis',
          featureName: 'credit_score',
          targetName: 'default_flag',
          createdAt: new Date('2025-09-01T14:30:00'),
          totalIV: 0.847,
          gini: 0.652,
          binCount: 8,
          isMonotonic: true,
          hasWarnings: false,
          results: {
            bins: [],
            statistics: { totalIV: 0.847, gini: 0.652, ks: 0.45 },
            validation: { isMonotonic: true, hasMinPopulation: true, warnings: [] }
          }
        },
        {
          id: '2',
          name: 'Income Analysis',
          featureName: 'annual_income',
          targetName: 'default_flag',
          createdAt: new Date('2025-08-30T10:15:00'),
          totalIV: 0.234,
          gini: 0.387,
          binCount: 6,
          isMonotonic: false,
          hasWarnings: true,
          results: {
            bins: [],
            statistics: { totalIV: 0.234, gini: 0.387, ks: 0.28 },
            validation: { isMonotonic: false, hasMinPopulation: true, warnings: ['Non-monotonic progression detected'] }
          }
        },
        {
          id: '3',
          name: 'Age Group Binning',
          featureName: 'age',
          targetName: 'churn_flag',
          createdAt: new Date('2025-08-28T16:45:00'),
          totalIV: 0.156,
          gini: 0.298,
          binCount: 5,
          isMonotonic: true,
          hasWarnings: false,
          results: {
            bins: [],
            statistics: { totalIV: 0.156, gini: 0.298, ks: 0.22 },
            validation: { isMonotonic: true, hasMinPopulation: true, warnings: [] }
          }
        }
      ]
      setAnalyses(sampleAnalyses)
    }
  }, [])

  // Filter and sort analyses
  const filteredAndSortedAnalyses = analyses
    .filter(analysis => 
      analysis.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      analysis.featureName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'iv':
          return b.totalIV - a.totalIV
        case 'date':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime()
      }
    })

  const deleteAnalysis = (id: string) => {
    const updatedAnalyses = analyses.filter(analysis => analysis.id !== id)
    setAnalyses(updatedAnalyses)
    localStorage.setItem('binning_analyses', JSON.stringify(updatedAnalyses))
    if (selectedAnalysis?.id === id) {
      setSelectedAnalysis(null)
    }
  }

  const exportAnalysis = (analysis: SavedAnalysis) => {
    const dataStr = JSON.stringify(analysis, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${analysis.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_analysis.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getIVColor = (iv: number) => {
    if (iv < 0.02) return 'text-red-600 bg-red-50'
    if (iv < 0.1) return 'text-orange-600 bg-orange-50'
    if (iv < 0.3) return 'text-yellow-600 bg-yellow-50'
    if (iv < 0.5) return 'text-green-600 bg-green-50'
    return 'text-purple-600 bg-purple-50'
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis History</h2>
        <p className="text-gray-600">
          Manage and review your previous binning analyses
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search analyses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'iv')}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="iv">Sort by IV</option>
          </select>

          <motion.button
            onClick={onNewAnalysis}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4" />
            <span>New Analysis</span>
          </motion.button>
        </div>
      </div>

      {filteredAndSortedAnalyses.length === 0 ? (
        <div className="text-center py-12">
          <Archive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No analyses found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery ? 'Try adjusting your search terms' : 'Start by creating your first binning analysis'}
          </p>
          <motion.button
            onClick={onNewAnalysis}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create First Analysis
          </motion.button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAndSortedAnalyses.map((analysis, index) => (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{analysis.name}</h3>
                    {analysis.hasWarnings && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Has Warnings
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Feature</div>
                      <div className="font-medium text-gray-900">{analysis.featureName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Target</div>
                      <div className="font-medium text-gray-900">{analysis.targetName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Bins</div>
                      <div className="font-medium text-gray-900">{analysis.binCount}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Created</div>
                      <div className="font-medium text-gray-900 text-sm">{formatDate(analysis.createdAt)}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">IV:</span>
                      <span className={`text-sm font-semibold px-2 py-1 rounded ${getIVColor(analysis.totalIV)}`}>
                        {analysis.totalIV.toFixed(3)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Gini:</span>
                      <span className="text-sm font-semibold text-blue-600">
                        {(analysis.gini * 100).toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Monotonic:</span>
                      <span className={`text-sm font-semibold ${
                        analysis.isMonotonic ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {analysis.isMonotonic ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <motion.button
                    onClick={() => setSelectedAnalysis(selectedAnalysis?.id === analysis.id ? null : analysis)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    onClick={() => onLoadAnalysis(analysis)}
                    className="p-2 text-emerald-600 hover:text-emerald-700 rounded-lg hover:bg-emerald-50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Load analysis"
                  >
                    <History className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    onClick={() => exportAnalysis(analysis)}
                    className="p-2 text-blue-600 hover:text-blue-700 rounded-lg hover:bg-blue-50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Export analysis"
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    onClick={() => deleteAnalysis(analysis.id)}
                    className="p-2 text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete analysis"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedAnalysis?.id === analysis.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Statistics
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total IV:</span>
                          <span className="font-medium">{analysis.results.statistics.totalIV.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Gini Coefficient:</span>
                          <span className="font-medium">{(analysis.results.statistics.gini * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">KS Statistic:</span>
                          <span className="font-medium">{(analysis.results.statistics.ks * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Validation
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monotonic:</span>
                          <span className={`font-medium ${
                            analysis.results.validation.isMonotonic ? 'text-green-600' : 'text-orange-600'
                          }`}>
                            {analysis.results.validation.isMonotonic ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Min Population:</span>
                          <span className={`font-medium ${
                            analysis.results.validation.hasMinPopulation ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {analysis.results.validation.hasMinPopulation ? 'Met' : 'Violated'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Warnings:</span>
                          <span className="font-medium text-gray-900">
                            {analysis.results.validation.warnings.length}
                          </span>
                        </div>
                      </div>

                      {analysis.results.validation.warnings.length > 0 && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                          <div className="font-medium text-yellow-800 mb-1">Warnings:</div>
                          <ul className="text-yellow-700 space-y-1">
                            {analysis.results.validation.warnings.map((warning, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>{warning}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {analyses.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{analyses.length}</div>
              <div className="text-sm text-gray-600">Total Analyses</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {analyses.filter(a => a.totalIV > 0.3).length}
              </div>
              <div className="text-sm text-gray-600">Strong Features</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {analyses.filter(a => a.isMonotonic).length}
              </div>
              <div className="text-sm text-gray-600">Monotonic</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {analyses.filter(a => a.hasWarnings).length}
              </div>
              <div className="text-sm text-gray-600">With Warnings</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
