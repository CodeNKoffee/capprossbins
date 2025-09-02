'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Database, Target, Eye, BarChart3, ArrowRight } from 'lucide-react'

interface DataInfo {
  filename: string
  rows: number
  columns: string[]
  preview: Record<string, unknown>[]
}

interface FeatureSelectorProps {
  dataInfo: DataInfo
  onFeatureSelect: (feature: string, target: string) => void
}

export default function FeatureSelector({ dataInfo, onFeatureSelect }: FeatureSelectorProps) {
  const [selectedFeature, setSelectedFeature] = useState<string>('')
  const [selectedTarget, setSelectedTarget] = useState<string>('')
  const [showPreview, setShowPreview] = useState(true)

  // Identify potential target columns
  const potentialTargets = dataInfo.columns.filter(col => 
    col.toLowerCase().includes('good_bad') ||
    col.toLowerCase().includes('target') ||
    col.toLowerCase().includes('default') ||
    col.toLowerCase().includes('bad') ||
    col.toLowerCase().includes('label')
  )

  // Identify potential feature columns (numeric)
  const potentialFeatures = dataInfo.columns.filter(col => {
    // Check if column values are numeric
    const sample = dataInfo.preview[0]?.[col]
    return typeof sample === 'number' || 
           (typeof sample === 'string' && !isNaN(parseFloat(sample))) ||
           col.toLowerCase().includes('amount') ||
           col.toLowerCase().includes('rate') ||
           col.toLowerCase().includes('ratio') ||
           col.toLowerCase().includes('income') ||
           col.toLowerCase().includes('util') ||
           col.toLowerCase().includes('balance')
  })

  const getColumnType = (column: string): string => {
    const sampleValue = dataInfo.preview[0]?.[column]
    if (typeof sampleValue === 'number') return 'numeric'
    if (typeof sampleValue === 'string' && !isNaN(parseFloat(sampleValue))) return 'numeric'
    return 'categorical'
  }

  const getColumnStats = (column: string) => {
    const values = dataInfo.preview.map(row => row[column]).filter(v => v != null)
    const uniqueValues = new Set(values).size
    const hasNulls = dataInfo.preview.some(row => row[column] == null || row[column] === '' || row[column] === -99999)
    
    return {
      uniqueValues,
      hasNulls,
      sampleValues: values.slice(0, 3)
    }
  }

  const handleContinue = () => {
    if (selectedFeature && selectedTarget) {
      onFeatureSelect(selectedFeature, selectedTarget)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Features for Binning</h2>
        <p className="text-gray-600">
          Choose the feature to bin and the target variable for analysis
        </p>
      </div>

      {/* Data Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Database className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">{dataInfo.filename}</h3>
              <p className="text-sm text-blue-700">
                {dataInfo.rows.toLocaleString()} rows × {dataInfo.columns.length} columns
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm">{showPreview ? 'Hide' : 'Show'} Preview</span>
          </button>
        </div>
      </div>

      {/* Data Preview */}
      {showPreview && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white border border-gray-200 rounded-lg overflow-hidden"
        >
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">Data Preview (First 5 rows)</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {dataInfo.columns.map(column => (
                    <th key={column} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dataInfo.preview.map((row, index) => (
                  <tr key={index}>
                    {dataInfo.columns.map(column => (
                      <td key={column} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {String(row[column] ?? 'null')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Feature Selection */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Target Column Selection */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">Target Column</h3>
          </div>
          <p className="text-sm text-gray-600">
            Select the binary target variable (0/1, good/bad)
          </p>
          
          <div className="space-y-2">
            {potentialTargets.length > 0 ? (
              potentialTargets.map(column => {
                const stats = getColumnStats(column)
                return (
                  <motion.button
                    key={column}
                    onClick={() => setSelectedTarget(column)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedTarget === column
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">{column}</div>
                        <div className="text-sm text-gray-600">
                          {stats.uniqueValues} unique values
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Sample: {stats.sampleValues.join(', ')}
                        </div>
                      </div>
                      {stats.hasNulls && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          Has nulls
                        </span>
                      )}
                    </div>
                  </motion.button>
                )
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-sm">No obvious target columns detected.</div>
                <div className="text-xs mt-1">Select from all columns below:</div>
                <select
                  value={selectedTarget}
                  onChange={(e) => setSelectedTarget(e.target.value)}
                  className="mt-2 border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Choose target column</option>
                  {dataInfo.columns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Feature Column Selection */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">Feature to Bin</h3>
          </div>
          <p className="text-sm text-gray-600">
            Select the numeric feature for binning analysis
          </p>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {potentialFeatures.map(column => {
              const stats = getColumnStats(column)
              const type = getColumnType(column)
              return (
                <motion.button
                  key={column}
                  onClick={() => setSelectedFeature(column)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedFeature === column
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="font-medium text-gray-900">{column}</div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          type === 'numeric' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {stats.uniqueValues} unique values
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Sample: {stats.sampleValues.join(', ')}
                      </div>
                    </div>
                    {stats.hasNulls && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Special values
                      </span>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center pt-6">
        <motion.button
          onClick={handleContinue}
          disabled={!selectedFeature || !selectedTarget}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
            selectedFeature && selectedTarget
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          whileHover={selectedFeature && selectedTarget ? { scale: 1.05 } : {}}
          whileTap={selectedFeature && selectedTarget ? { scale: 0.95 } : {}}
        >
          <span>Continue to Binning</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Selection Summary */}
      {(selectedFeature || selectedTarget) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 rounded-lg p-4"
        >
          <h4 className="font-medium text-emerald-900 mb-2">Selection Summary</h4>
          <div className="space-y-1 text-sm text-emerald-800">
            {selectedFeature && (
              <div>Feature to bin: <span className="font-medium">{selectedFeature}</span></div>
            )}
            {selectedTarget && (
              <div>Target variable: <span className="font-medium">{selectedTarget}</span></div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
