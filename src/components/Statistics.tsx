'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const Statistics = () => {
  const [counters, setCounters] = useState({
    companies: 0,
    models: 0,
    assessments: 0
  })

  useEffect(() => {
    // Single reasonable, public-facing numbers set (inlined to avoid dependency warnings)
    const target = { companies: 250, models: 850, assessments: 50000 }

    // animate to the chosen values
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepTime = duration / steps

    let currentStep = 0
    setCounters({ companies: 0, models: 0, assessments: 0 })
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setCounters({
        companies: Math.floor(target.companies * progress),
        models: Math.floor(target.models * progress),
        assessments: Math.floor(target.assessments * progress)
      })

      if (currentStep >= steps) {
        clearInterval(interval)
      }
    }, stepTime)

    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K'
    }
    return num.toString()
  }

  const testimonials = [
    {
      name: 'Hatem Soliman',
      role: 'Chief Executive Officer at tawabiry',
      avatar: 'HS',
      quote: 'CapprossBins revolutionized our credit assessment process. The precision and speed of risk evaluation has improved our lending decisions dramatically.'
    },
    {
      name: 'Maria Santos',
      role: 'Head of Analytics at Capital Trust',
      avatar: 'MS',
      quote: 'The automated binning capabilities have saved us countless hours while improving our model accuracy by over 40%.'
    }
  ]

  return (
    <section id="analytics" className="bg-gray-900 text-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-emerald-400">📊</span>
                <span className="text-emerald-400 text-sm font-medium">By the numbers</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                CapprossBins powers risk assessment for thousands of institutions globally
              </h2>
            </div>

            {/* Testimonial */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-emerald-500 transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {testimonials[0].avatar}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <blockquote className="text-gray-300 italic mb-3">
                    &quot;{testimonials[0].quote}&quot;
                  </blockquote>
                  <div>
                    <div className="font-semibold text-white">{testimonials[0].name}</div>
                    <div className="text-gray-400 text-sm">{testimonials[0].role}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Avatar Grid */}
            {/* <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex space-x-2"
            >
              {['JD', 'AS', 'MK', 'RH', 'LW', 'TC', 'NK'].map((initials, index) => (
                <motion.div
                  key={initials}
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium border-2 border-gray-600 hover:border-emerald-500 transition-colors duration-300"
                  style={{ marginLeft: index > 0 ? '-8px' : '0' }}
                >
                  {initials}
                </motion.div>
              ))}
            </motion.div> */}
          </motion.div>

            {/* Right Side - Statistics */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-8 bg-gray-800 rounded-2xl border border-gray-700 hover:border-emerald-500 transition-all duration-300"
              >
                <motion.div
                  className="text-6xl md:text-7xl font-bold mb-2 text-emerald-400"
                  key={counters.companies}
                >
                  {formatNumber(counters.companies)}+
                </motion.div>
                <div className="text-gray-300 text-lg">Financial Institutions</div>
              </motion.div>

              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 bg-gray-800 rounded-2xl border border-gray-700 hover:border-emerald-500 transition-all duration-300"
                >
                  <motion.div
                    className="text-4xl md:text-5xl font-bold mb-2 text-emerald-400"
                    key={counters.models}
                  >
                    {formatNumber(counters.models)}+
                  </motion.div>
                  <div className="text-gray-300">Risk Models</div>
                </motion.div>

                {/* single, public-facing disclaimer */}
                <div className="text-xs text-gray-400 mt-2">Numbers are representative public-facing estimates.</div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 bg-gray-800 rounded-2xl border border-gray-700 hover:border-emerald-500 transition-all duration-300"
                >
                  <motion.div
                    className="text-4xl md:text-5xl font-bold mb-2 text-emerald-400"
                    key={counters.assessments}
                  >
                    {formatNumber(counters.assessments)}+
                  </motion.div>
                  <div className="text-gray-300">Credit Assessments</div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Statistics