'use client'

import { motion } from 'framer-motion'
import { Twitter, Linkedin, Github } from 'lucide-react'

const footerLinks = {
  product: [
    { name: 'Pricing', href: '#' },
    { name: 'Data Room', href: '#' },
    { name: 'Enterprise', href: '#' },
    { name: 'Page Analytics', href: '#' },
    { name: 'Dynamic Binning', href: '#' },
    { name: 'Model Protection', href: '#' },
    { name: 'Password Protection', href: '#' },
    { name: 'One-Click Validation', href: '#' },
    { name: 'AI Model Assistant', href: '#' },
    { name: 'Credit Score Sharing', href: '#' },
    { name: 'Secure Model Sharing', href: '#' }
  ],
  resources: [
    { name: 'Risk Assessment Hub', href: '#' },
    { name: 'Changelog', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Security', href: '#' },
    { name: 'Model Validators', href: '#' },
    { name: 'Customers', href: '#' },
    { name: 'Become a partner', href: '#' },
    { name: 'Launch Week 2023', href: '#' }
  ],
  binningFor: [
    { name: 'Banks', href: '#' },
    { name: 'Risk Management', href: '#' },
    { name: 'Model Tracking', href: '#' },
    { name: 'Compliance Document Sharing', href: '#' },
    { name: 'Small & Enterprise Credit Scoring', href: '#' },
    { name: 'Regulatory Update Software', href: '#' },
    { name: 'Credit Model Sharing', href: '#' }
  ],
  support: [
    { name: 'Help Center', href: '#' },
    { name: 'What is a Data Room?', href: '#' },
    { name: 'What is a Model Room?', href: '#' },
    { name: 'Create Shareable Link', href: '#' },
    { name: 'Link Permissions', href: '#' },
    { name: 'Custom Domain', href: '#' },
    { name: 'Model Versions', href: '#' },
    { name: 'Track Time on Model', href: '#' }
  ]
}

const tools = [
  'Credit Scoring Calculator',
  'Model Performance Tracker',
  'Risk Assessment Tool',
  'Binning Optimizer'
]

const dataRoom = [
  'Model Validation Room',
  'Compliance Data Room',
  'Risk Assessment Room'
]

const alternatives = [
  'vs Traditional Scoring',
  'vs Manual Binning',
  'vs SAS Enterprise Miner'
]

const readMore = [
  'Blog',
  'Case Studies',
  'Whitepapers',
  'Documentation'
]

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">CapprossBins</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Advanced credit binning, securely and on brand.
              </p>
              
              {/* Compliance Badges */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                  <span className="text-xs font-semibold">GDPR</span>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
                  <span className="text-xs font-semibold">CCPA</span>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex items-center gap-4 mb-6">
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                >
                  <Twitter className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
                <motion.a
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  className=" flex justify-between items-center text-gray-400 hover:text-blue-600 transition-colors duration-200"
                >
                  <Github className="w-5 h-5" />
                  <span className="ml-2 text-sm font-semibold text-gray-900">7.4K</span>
                </motion.a>
              </div>
              
              {/* Status */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">All Systems Operational</span>
              </div>
            </motion.div>
          </div>

          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-semibold text-gray-900 mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Binning For Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="font-semibold text-gray-900 mb-4">Binning for</h4>
            <ul className="space-y-3">
              {footerLinks.binningFor.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 border-t border-gray-200"
        >
          {/* Tools */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-3 text-sm">Tools</h5>
            <ul className="space-y-2">
              {tools.map((tool, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    {tool}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Data Room */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-3 text-sm">Data Room</h5>
            <ul className="space-y-2">
              {dataRoom.map((room, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    {room}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Alternatives */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-3 text-sm">Alternatives</h5>
            <ul className="space-y-2">
              {alternatives.map((alt, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    {alt}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Read More */}
          <div>
            <h5 className="font-semibold text-gray-900 mb-3 text-sm">Read more</h5>
            <ul className="space-y-2">
              {readMore.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="pt-8 mt-8 border-t border-gray-200 text-center"
        >
          <p className="text-sm text-gray-500">
            © 2024 CapprossBins. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}