'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const Analytics = () => {
  const [activeVersion, setActiveVersion] = useState(1)
  const [chartData, setChartData] = useState([
    { page: 1, value: 0.12, height: 20 },
    { page: 2, value: 0.08, height: 15 },
    { page: 3, value: 0.15, height: 28 },
    { page: 4, value: 0.09, height: 18 },
    { page: 5, value: 0.11, height: 22 },
    { page: 6, value: 0.25, height: 45 },
    { page: 7, value: 0.13, height: 25 },
    { page: 8, value: 0.07, height: 12 },
    { page: 9, value: 0.18, height: 35 },
    { page: 10, value: 0.22, height: 40 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveVersion(prev => prev === 1 ? 2 : 1)
      setChartData(prev => prev.map(item => ({
        ...item,
        value: Math.random() * 0.3,
        height: Math.random() * 50 + 10
      })))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="bg-white py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Analytics Dashboard */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">BS</span>
                  </div>
                  <span className="font-medium">Risk Model</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Link href="/login" className="bg-black text-white px-3 py-1 rounded text-sm">
                    Create Bin
                  </Link>
                  <button className="text-gray-500">⋯</button>
                </div>
              </div>
            </div>

            {/* Sidebar and Content */}
            <div className="flex h-96">
              <div className="w-48 bg-gray-50 border-r border-gray-200 p-4">
                <div className="space-y-2">
                  <div className="font-medium text-sm text-gray-900 bg-gray-200 px-2 py-1 rounded">
                    📊 Models
                  </div>
                  <div className="text-sm text-gray-600 pl-4">▶ Primary</div>
                  <div className="text-sm text-gray-600 pl-4">▶ Shadow</div>
                  <div className="text-sm text-gray-600 mt-4">🔧 Binning</div>
                  <div className="text-sm text-gray-600">⚙️ Settings</div>
                </div>
              </div>

              <div className="flex-1 p-4">
                {/* Chart */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium">Risk Score Distribution</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Version {activeVersion}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-emerald-300 rounded-full"></div>
                        <span className="text-xs text-gray-600">Version {activeVersion === 1 ? 2 : 1}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end space-x-1 h-32">
                    {chartData.map((item, index) => (
                      <motion.div
                        key={item.page}
                        animate={{ height: `${item.height}%` }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="bg-emerald-500 rounded-t flex-1 min-h-2"
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Low Risk</span>
                    <span>High Risk</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-2xl font-bold">2.4K</div>
                    <div className="text-xs text-gray-600">Models Scored</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-xs text-gray-600">Alerts</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">94</div>
                    <div className="text-xs text-gray-600">Accuracy %</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900">
                Smart Risk Assessment.<br />
                Real-time Binning Analytics.
              </h2>
              <p className="text-lg text-gray-600">
                Advanced machine learning algorithms for precise credit scoring.
                Your comprehensive alternative to traditional risk models. AI-Powered.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="text-sm font-medium text-gray-900 mb-1">Upload Credit Data</div>
                <div className="text-xs text-gray-600">Secure data ingestion</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="text-sm font-medium text-gray-900 mb-1">Set Binning Rules</div>
                <div className="text-xs text-gray-600">Custom risk parameters</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-orange-50 border border-orange-200 rounded-lg p-4"
              >
                <div className="text-sm font-medium text-gray-900 mb-1">Track Model Performance</div>
                <div className="text-xs text-gray-600">Real-time monitoring</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="text-sm font-medium text-gray-900 mb-1">Generate Risk Reports</div>
                <div className="text-xs text-gray-600">Automated insights</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Analytics