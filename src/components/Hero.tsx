'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import tawabiry from "../../public/assets/images/tawabiry-light.svg";
import Image from 'next/image';

const Hero = () => {
  const [currentLogo, setCurrentLogo] = useState(0)
  // Financial institutions that would use credit scoring and binning
  const logos = [
    { name: 'Tawabiry', image: tawabiry },
    // { name: 'JPMorgan', image: null },
    // { name: 'Citi', image: null },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogo((prev) => (prev + 1) % logos.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [logos.length])

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight"
          >
            Intelligent
            <br />
            <span className="text-emerald-600">Credit Scoring & Binning</span>
          </motion.h1>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 space-y-4"
          >
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your binning engine for transparent, intelligent credit scoring.<br />Built for clarity. Powered by binning. Trusted in credit scoring
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10"
          >
            <motion.a
              href='/#early-access'
              whileHover={{ scale: 1.05, backgroundColor: '#1f2937' }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors"
            >
              Join the Waitlist →
            </motion.a>
            {/* <p className="text-sm text-gray-500 mt-8">Open source • Self-hosted • No credit card required</p> */}
            <p className="text-sm text-gray-500 mt-8">Managed by our team • Reliable service, no setup needed</p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-20"
          >
            <p className="text-sm text-gray-500 mb-6">Trusted by leading financial & tech institutions</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              {logos.map((logo, index) => (
                <motion.div
                  key={logo.name}
                  animate={{ 
                    opacity: index === currentLogo ? 1 : 0.3,
                    scale: index === currentLogo ? 1.1 : 1
                  }}
                  className="flex flex-col items-center text-2xl font-semibold text-gray-600"
                >
                  {logo.image ? (
                    <Image src={logo.image} alt={logo.name} className="h-8 mb-1" width={104} height={224} />
                  ) : (
                    <span>{logo.name}</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero