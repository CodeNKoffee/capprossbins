'use client'

import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8"
        >
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">CapprossBins</h3>
            <p className="text-gray-600 leading-relaxed">
              Intelligent credit binning, securely and on brand.
            </p>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-500">
            © {currentYear} CapprossBins. All rights reserved.
          </div>
        </motion.div>
      </div>
    </footer>
  )
}