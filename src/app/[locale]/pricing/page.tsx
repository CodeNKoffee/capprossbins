'use client'

import { motion } from 'framer-motion'
import { Check, Zap, Star, ArrowRight, Users, BarChart3, Clock } from 'lucide-react'
import Link from 'next/link'
import Footer from '../../../components/Footer'

const features = [
  'Unlimited data uploads up to 50MB',
  'Advanced binning algorithms',
  'Interactive visualization dashboard',
  'Export to CSV, PDF, and Excel',
  'Analysis history & management',
  'Email support',
  'Data security & privacy'
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-2xl text-gray-900">CapprossBins</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
          >
            Choose Your Plan
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Your binning engine for transparent, intelligent credit scoring.<br />
            Start with our free trial and upgrade when you need more.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          {/* Free Trial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-200 p-8 relative"
          >
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Trial</h3>
              <p className="text-gray-600 mb-6">Perfect for getting started</p>
              
              <div className="relative">
                <div className="text-4xl font-bold text-gray-900 line-through opacity-50 mb-2">
                  $29/month
                </div>
                <div className="absolute -top-2 -right-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold transform rotate-12">
                  FREE!
                </div>
                <div className="text-2xl font-bold text-emerald-600">
                  100% Free
                </div>
                <p className="text-gray-500 text-sm mt-2">For the first 3 months</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <Link
              href="/auth/register"
              className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 flex items-center justify-center"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                No credit card required • Cancel anytime
              </p>
            </div>
          </motion.div>

          {/* Custom Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border-2 border-emerald-600 p-8 relative transform scale-105"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold">
              Most Popular
            </div>

            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Tailored Plan</h3>
              <p className="text-gray-600 mb-6">Customized for your needs</p>
              
              <div className="relative">
                <div className="text-2xl font-bold text-emerald-600">
                  Custom Pricing
                </div>
                <p className="text-gray-500 text-sm mt-2">Built for your organization</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {[...features, 'Custom integration & API access', 'Dedicated account manager', 'Priority support (24/7)', 'Custom algorithms & models', 'Team collaboration features', 'Advanced security & compliance'].map((feature, index) => (
                <div key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-emerald-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center"
            >
              Contact Sales
            </button>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Custom solutions available
              </p>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-3xl mx-auto">
            <div className="space-y-6 text-left">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  What file formats do you support?
                </h3>
                <p className="text-gray-600">
                  We support CSV, Excel (.xlsx, .xls) files up to 50MB. 
                  More formats coming soon.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Is my data secure?
                </h3>
                <p className="text-gray-600">
                  Yes, we use industry-standard encryption and security measures. 
                  Your data is never shared with third parties.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        
      </div>
      <Footer />
    </div>
  )
}
