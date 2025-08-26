'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const navLinks = [
    { name: 'Why CapprossBins?', href: '#', hasDropdown: true },
    { name: 'Analytics', href: '#analytics' },
    // { name: 'Pricing', href: '/pricing' },
    // { name: 'Enterprise', href: '#' },
    // { name: 'Blog', href: '/blog' },
    { name: 'Customers', href: '#customers' },
  ]

  // Comparison data for the dropdown
  const comparisons = [
    {
      feature: "Setup Time",
      us: "5 minutes",
      competitor: "2-3 hours",
      advantage: "60x faster deployment"
    },
    {
      feature: "AI Accuracy",
      us: "99.7%",
      competitor: "87.3%",
      advantage: "12.4% higher accuracy"
    },
    {
      feature: "Cost per Analysis",
      us: "$0.003",
      competitor: "$0.12",
      advantage: "97% cost reduction"
    },
    {
      feature: "Real-time Processing",
      us: "Yes",
      competitor: "Limited",
      advantage: "Full real-time capabilities"
    }
  ];

  const benefits = [
    {
      icon: "🚀",
      title: "Lightning Fast",
      description: "Deploy in minutes, not hours. Our AI-powered bins start working immediately."
    },
    {
      icon: "🎯",
      title: "Precision Analytics",
      description: "Industry-leading 99.7% accuracy in waste categorization and volume prediction."
    },
    {
      icon: "💰",
      title: "Cost Effective",
      description: "Reduce operational costs by up to 40% with intelligent routing and optimization."
    },
    {
      icon: "🌱",
      title: "Sustainability Focus",
      description: "Track and improve your environmental impact with detailed carbon footprint analytics."
    }
  ];

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close menu when clicking on a link
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full bg-white border-b border-gray-100 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 relative">
            <div className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold text-gray-900"
              >
                CapprossBins
              </motion.div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((navLink) => (
                <div 
                  key={navLink.name} 
                  className="relative"
                  onMouseEnter={() => navLink.hasDropdown && setIsDropdownOpen(true)}
                  onMouseLeave={() => navLink.hasDropdown && setIsDropdownOpen(false)}
                >
                  <motion.a
                    href={navLink.href}
                    whileHover={{ scale: 1.05 }}
                    className="text-gray-600 hover:text-gray-900 transition-colors flex items-center"
                  >
                    {navLink.name}
                    {navLink.hasDropdown && (
                      <motion.svg 
                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-1 w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    )}
                  </motion.a>
                </div>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <select className="text-sm text-gray-600 bg-transparent">
                <option>EN</option>
              </select>
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.05, backgroundColor: '#1f2937' }}
                className="bg-black text-white ml-2 px-4 py-2 rounded-lg transition-colors"
              >
                Try a Demo
              </motion.a>
            </div>

            {/* Mobile Hamburger Button */}
            <motion.button
              className="md:hidden z-50 relative"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 8 : 1 }}
                transition={{ duration: 0.3 }}
                className="w-6 h-0.5 bg-black mb-1.5"
              />
              <motion.div
                animate={{ opacity: isMenuOpen ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                className="w-6 h-0.5 bg-black mb-1.5"
              />
              <motion.div
                animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -8 : -1 }}
                transition={{ duration: 0.3 }}
                className="w-6 h-0.5 bg-black"
              />
            </motion.button>
          </div>
        </div>

        {/* Innovative Sales Dropdown */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-2xl"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  
                  {/* Left Side - Benefits */}
                  <div>
                    <motion.h3 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-2xl font-bold text-gray-900 mb-6"
                    >
                      Why Industry Leaders Choose CapprossBins
                    </motion.h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {benefits.map((benefit, index) => (
                        <motion.div
                          key={benefit.title}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          whileHover={{ scale: 1.02, backgroundColor: '#f9fafb' }}
                          className="p-4 rounded-lg transition-all duration-200"
                        >
                          <div className="text-2xl mb-2">{benefit.icon}</div>
                          <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                          <p className="text-sm text-gray-600">{benefit.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side - Competitive Comparison */}
                  <div>
                    <motion.h3 
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-2xl font-bold text-gray-900 mb-6"
                    >
                      CapprossBins vs Traditional Solutions
                    </motion.h3>
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
                      <div className="space-y-4">
                        {comparisons.map((comp, index) => (
                          <motion.div
                            key={comp.feature}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                          >
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{comp.feature}</div>
                              <div className="text-sm text-green-600 font-semibold">{comp.advantage}</div>
                            </div>
                            <div className="flex items-center space-x-4 text-sm">
                              <div className="text-center">
                                <div className="text-gray-500">Others</div>
                                <div className="font-medium text-red-600">{comp.competitor}</div>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                              <div className="text-center">
                                <div className="text-gray-500">CapprossBins</div>
                                <div className="font-bold text-green-600">{comp.us}</div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* CTA in dropdown */}
                      <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-6 text-center"
                      >
                        <motion.a
                          href="/signup"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <span>See the Difference Yourself</span>
                          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </motion.a>
                        <div className="mt-2 text-sm text-gray-500">
                          Join 500+ companies already saving with CapprossBins
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Full-Screen Overlay Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-white/80 backdrop-blur-md z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Full-screen menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ 
                type: 'tween',
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              className="fixed top-0 right-0 w-full h-screen bg-white z-40 md:hidden overflow-y-auto"
            >
              {/* Menu Content */}
              <div className="pt-20 pb-8 px-0 h-full flex flex-col">
                {/* Navigation Links */}
                <nav className="flex-1 flex flex-col">
                  {navLinks.map((navLink, index) => (
                    <motion.a
                      key={navLink.name}
                      href={navLink.href}
                      onClick={handleLinkClick}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="w-full text-center py-6 text-2xl font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-b border-gray-100 transition-all duration-200"
                    >
                      {navLink.name}
                    </motion.a>
                  ))}
                  
                  <motion.a
                    href="/login"
                    onClick={handleLinkClick}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: navLinks.length * 0.1 }}
                    className="w-full text-center py-6 text-2xl font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-b border-gray-100 transition-all duration-200"
                  >
                    Log in
                  </motion.a>
                </nav>

                {/* CTA Button at bottom */}
                <div className="px-6 pb-8">
                  <motion.a
                    href="/signup"
                    onClick={handleLinkClick}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: (navLinks.length + 1) * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full block text-center py-4 bg-black text-white text-xl font-medium rounded-lg transition-all duration-200"
                  >
                    Start now
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header