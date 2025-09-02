'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Eye, 
  AlertCircle,
  CheckCircle,
  Info,
  Target
} from 'lucide-react'

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

interface ResultsDashboardProps {
  results: BinningResults
  featureName: string
  onSave: () => void
  onExport: () => void
}

export default function ResultsDashboard({
  results,
  featureName,
  onSave,
  onExport
}: ResultsDashboardProps) {
  const [activeChart, setActiveChart] = useState<'badRate' | 'population' | 'woe'>('badRate')
  const [showDetails, setShowDetails] = useState(false)

  const getIVInterpretation = (iv: number) => {
    if (iv < 0.02) return { level: 'Not useful', color: 'text-red-600', bg: 'bg-red-50' }
    if (iv < 0.1) return { level: 'Weak', color: 'text-orange-600', bg: 'bg-orange-50' }
    if (iv < 0.3) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    if (iv < 0.5) return { level: 'Strong', color: 'text-green-600', bg: 'bg-green-50' }
    return { level: 'Suspicious', color: 'text-purple-600', bg: 'bg-purple-50' }
  }

  const ivInterpretation = getIVInterpretation(results.statistics.totalIV)

  // Generate chart data for visualization
  const chartData = {
    badRate: results.bins.map(bin => ({
      label: typeof bin.binNumber === 'string' ? bin.binNumber : `Bin ${bin.binNumber}`,
      value: bin.badRate * 100,
      count: bin.count
    })),
    population: results.bins.map(bin => ({
      label: typeof bin.binNumber === 'string' ? bin.binNumber : `Bin ${bin.binNumber}`,
      value: bin.percentage,
      count: bin.count
    })),
    woe: results.bins.map(bin => ({
      label: typeof bin.binNumber === 'string' ? bin.binNumber : `Bin ${bin.binNumber}`,
      value: bin.woe,
      iv: bin.iv
    }))
  }

  const renderChart = (type: 'badRate' | 'population' | 'woe') => {
    const data = chartData[type]
    const maxValue = Math.max(...data.map(d => Math.abs(d.value)))
    
    return (
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-16 text-xs text-gray-600 truncate">{item.label}</div>
            <div className="flex-1 relative">
              <div className="h-6 bg-gray-100 rounded">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(Math.abs(item.value) / maxValue) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`h-full rounded ${
                    type === 'badRate' ? 'bg-red-500' :
                    type === 'population' ? 'bg-blue-500' : 
                    item.value >= 0 ? 'bg-green-500' : 'bg-red-500'
                  } ${item.value < 0 ? 'ml-auto' : ''}`}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                {type === 'woe' ? item.value.toFixed(3) : `${item.value.toFixed(1)}${type === 'badRate' ? '%' : type === 'population' ? '%' : ''}`}
              </div>
            </div>
            {type === 'badRate' && 'count' in item && (
              <div className="w-16 text-xs text-gray-500 text-right">
                {item.count.toLocaleString()}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Binning Analysis Results</h2>
        <p className="text-gray-600">
          Statistical analysis and validation for <span className="font-semibold">{featureName}</span>
        </p>
      </div>

      {/* Key Statistics */}
      <div className="grid md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${ivInterpretation.bg} border border-gray-200 rounded-lg p-4`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Information Value</h3>
              <div className="text-2xl font-bold text-gray-900">
                {results.statistics.totalIV.toFixed(3)}
              </div>
              <div className={`text-sm font-medium ${ivInterpretation.color}`}>
                {ivInterpretation.level}
              </div>
            </div>
            <Target className={`w-8 h-8 ${ivInterpretation.color}`} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Gini Coefficient</h3>
              <div className="text-2xl font-bold text-gray-900">
                {(results.statistics.gini * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-blue-600">
                Discrimination Power
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">KS Statistic</h3>
              <div className="text-2xl font-bold text-gray-900">
                {(results.statistics.ks * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-green-600">
                Separation Power
              </div>
            </div>
            <BarChart3 className="w-8 h-8 text-green-600" />
          </div>
        </motion.div>
      </div>

      {/* Validation Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Info className="w-4 h-4 mr-2" />
          Validation Summary
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            {results.validation.isMonotonic ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-600" />
            )}
            <span className="text-sm">
              {results.validation.isMonotonic ? 'Monotonic progression' : 'Non-monotonic progression'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {results.validation.hasMinPopulation ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-orange-600" />
            )}
            <span className="text-sm">
              {results.validation.hasMinPopulation ? 'Population constraints met' : 'Population constraints violated'}
            </span>
          </div>
        </div>

        {results.validation.warnings.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              Warnings
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              {results.validation.warnings.map((warning, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Visualization</h3>
          <div className="flex space-x-2">
            {[
              { key: 'badRate', label: 'Bad Rate', icon: TrendingUp },
              { key: 'population', label: 'Population', icon: PieChart },
              { key: 'woe', label: 'WoE', icon: BarChart3 }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveChart(key as 'badRate' | 'population' | 'woe')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeChart === key
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[300px]">
          {renderChart(activeChart)}
        </div>
      </div>

      {/* Detailed Statistics Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Detailed Statistics</h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center space-x-2 text-sm text-emerald-600 hover:text-emerald-700"
          >
            <Eye className="w-4 h-4" />
            <span>{showDetails ? 'Hide Details' : 'Show Details'}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bin
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Range
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Count
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  %
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bad Rate
                </th>
                {showDetails && (
                  <>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      WoE
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IV
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.bins.map((bin, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {typeof bin.binNumber === 'string' ? bin.binNumber : `Bin ${bin.binNumber}`}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {bin.range}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {bin.count.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {bin.percentage.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-medium ${
                      bin.badRate > 0.3 ? 'text-red-600' : 
                      bin.badRate > 0.15 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {(bin.badRate * 100).toFixed(1)}%
                    </span>
                  </td>
                  {showDetails && (
                    <>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">
                        {bin.woe.toFixed(3)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">
                        {bin.iv.toFixed(4)}
                      </td>
                    </>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <motion.button
          onClick={onSave}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="w-4 h-4" />
          <span>Save Analysis</span>
        </motion.button>

        <motion.button
          onClick={onExport}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="w-4 h-4" />
          <span>Export Results</span>
        </motion.button>
      </div>
    </div>
  )
}
