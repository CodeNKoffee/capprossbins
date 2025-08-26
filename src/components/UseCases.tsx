'use client'

import { motion } from 'framer-motion'

const UseCases = () => {
  const useCases = [
    {
      category: 'Commercial Banking',
      title: 'Assess loan default risk with precision scoring',
      bg: 'bg-gray-100',
      textColor: 'text-gray-900'
    },
    {
      category: 'Fintech',
      title: 'Scale credit decisions with automated binning',
      bg: 'bg-gray-800',
      textColor: 'text-white'
    },
    {
      category: 'Investment',
      title: 'Optimize portfolio risk with advanced analytics',
      bg: 'bg-gray-100',
      textColor: 'text-gray-900'
    },
    {
      category: 'Insurance',
      title: 'Enhance underwriting with ML-driven insights',
      bg: 'bg-gray-800',
      textColor: 'text-white'
    },
    {
      category: 'Credit Unions',
      title: 'Improve member risk assessment accuracy',
      bg: 'bg-gray-100',
      textColor: 'text-gray-900'
    },
    {
      category: 'Lending',
      title: 'Streamline approval process with smart binning',
      bg: 'bg-gray-800',
      textColor: 'text-white'
    }
  ]

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            For every credit decision and risk process to be made efficiently.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <motion.a
              key={index}
              href="/signup"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
              }}
              className={`${useCase.bg} ${useCase.textColor} p-8 rounded-2xl min-h-48 flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-lg transition-all`}
            >
              <div>
                <div className="text-sm font-medium opacity-80 mb-4">
                  {useCase.category}
                </div>
                <h3 className="text-xl font-semibold leading-tight">
                  {useCase.title}
                </h3>
              </div>
              <motion.div
                whileHover={{ x: 5 }}
                className="mt-6"
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className={`${useCase.textColor === 'text-white' ? 'text-white' : 'text-gray-900'}`}
                >
                  <path 
                    d="M7 17L17 7M17 7H7M17 7V17" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UseCases