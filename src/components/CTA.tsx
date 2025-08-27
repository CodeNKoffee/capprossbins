'use client'

import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-emerald-600 via-emerald-700 to-gray-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <span className="inline-block px-4 py-2 bg-emerald-500 bg-opacity-20 rounded-full text-emerald-100 text-sm font-medium mb-6">
              🚀 Ready for digital transformation?
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Credit binning made secure,{' '}
            <span className="text-emerald-300">fast, and intelligent.</span>
          </h2>
          
          <p className="text-emerald-100 text-lg md:text-xl mb-10 max-w-3xl mx-auto">
            Join thousands of financial institutions using CapprossBins for advanced risk assessment.
            Start building better credit models today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: '#f3f4f6' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Book a Demo →
            </motion.button>
            
            {/* <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:bg-opacity-10 transition-all duration-200"
            >
              Start for Free
            </motion.button> */}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-emerald-200 text-sm"
          >
            {/* ✓ No credit card required &nbsp;&nbsp; ✓ Open source &nbsp;&nbsp; ✓ Self-hosted option available */}
            ✓ Managed by our team &nbsp;&nbsp; ✓ Reliable service, no setup needed
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}