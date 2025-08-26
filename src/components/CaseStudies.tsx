'use client'

import { motion } from 'framer-motion'

const CaseStudies = () => {
  const caseStudies = [
    {
      company: 'FinTech Pro',
      industry: ['Fintech', 'Lending'],
      title: 'How FinTech Pro scaled to 50K credit assessments using CapprossBins analytics',
      image: '/api/placeholder/400/250',
      people: [
        { name: 'Alex Chen', role: 'CTO' },
        { name: 'Sarah Kim', role: 'Head of Risk' }
      ]
    },
    {
      company: 'Regional Credit Union',
      industry: ['Credit Union', 'Risk Management'],
      title: 'Regional Credit Union reduces default rates by 35% with CapprossBins Models',
      image: '/api/placeholder/400/250',
      people: [
        { name: 'Michael Rodriguez', role: 'Risk Director' },
        { name: 'Jennifer Wong', role: 'Analytics Lead' }
      ]
    }
  ]

  return (
    <section id="customers" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Don&apos;t take our word for it
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Read how our customers achieve better risk outcomes with CapprossBins
          </p>
          <motion.a
            href="/case-studies"
            whileHover={{ scale: 1.05 }}
            className="text-gray-600 hover:text-gray-900 flex items-center mx-auto w-fit"
          >
            To all stories →
          </motion.a>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2,
              }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
            >
              {/* Image Section with Overlay */}
              <div className="relative h-64 bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-white text-sm font-medium">{study.company}</span>
                </div>
                
                {/* Mock people photos */}
                <div className="flex space-x-4">
                  {study.people.map((person, pIndex) => (
                    <div
                      key={pIndex}
                      className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm"
                    >
                      <span className="text-white font-semibold text-lg">
                        {person.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {study.industry.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4 leading-tight">
                  {study.title}
                </h3>

                <div className="space-y-2">
                  {study.people.map((person, pIndex) => (
                    <div key={pIndex} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-xs font-medium">
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{person.name}</div>
                        <div className="text-xs text-gray-600">{person.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CaseStudies