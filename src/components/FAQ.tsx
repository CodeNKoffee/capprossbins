'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqData = [
  {
    question: "What is Credit Binning?",
    answer: "Credit binning is a statistical technique used to group credit applicants or accounts into different risk categories based on their credit characteristics. It helps lenders make more informed decisions by segmenting customers into homogeneous groups for better risk assessment and pricing strategies."
  },
  {
    question: "How to use CapprossBins Platform?",
    answer: "Our platform simplifies the binning process through an intuitive interface. Upload your credit data, select your binning criteria, and our AI-powered algorithms will automatically create optimal risk segments. You can customize bin boundaries, validate results, and export scorecards for implementation."
  },
  // {
  //   question: "Is CapprossBins free?",
  //   answer: "We offer a free tier that includes basic binning functionality for up to 10,000 records per month. For enterprise features like advanced analytics, custom algorithms, and unlimited processing, we offer competitive pricing plans starting from $99/month."
  // },
  // {
  //   question: "Can I integrate with custom domain and branding?",
  //   answer: "Yes! Our enterprise plan allows you to white-label the platform with your custom domain, logo, and brand colors. You can also integrate our binning API directly into your existing credit decisioning systems for seamless workflow integration."
  // },
  {
    question: "What are Credit Scoring Data Rooms?",
    answer: "Data Rooms are secure, collaborative spaces where you can share binning results, scorecards, and credit models with stakeholders, regulators, or third-party validators. They provide controlled access with detailed audit trails and real-time collaboration features."
  },
  // {
  //   question: "Can I self-host CapprossBins?",
  //   answer: "Yes, we offer on-premises deployment options for organizations with strict data governance requirements. Our self-hosted solution provides the same functionality as our cloud platform while ensuring your sensitive credit data never leaves your infrastructure."
  // },
  // {
  //   question: "How can I contribute to CapprossBins?",
  //   answer: "We welcome contributions from the credit risk community! You can contribute by sharing new binning algorithms, validation techniques, or industry-specific models through our developer portal. We also offer bounties for significant algorithmic improvements."
  // },
  {
    question: "Who can use CapprossBins?",
    answer: "Our platform is designed for credit risk professionals, data scientists, financial institutions, fintech companies, and anyone involved in credit scoring and risk assessment. It's suitable for both beginners learning about binning and experts building sophisticated models."
  },
  {
    question: "How to implement model validation as a risk manager?",
    answer: "Our platform includes comprehensive model validation tools including population stability index (PSI), characteristic stability index (CSI), and performance monitoring. You can set up automated alerts for model drift and generate regulatory-compliant validation reports."
  }
]

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-6 text-left flex items-center justify-between transition-colors duration-200 px-4"
      >
        <span className="text-lg font-medium text-gray-900 pr-8">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-emerald-600' : 'text-gray-500'} transition-colors duration-200`} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden px-4"
          >
            <div className="pb-6 text-gray-600 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            FAQ <span className="text-emerald-600">Credit Binning</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Everything you need to know about CapprossBins and credit risk modeling
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden"
        >
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openItems.has(index)}
              onToggle={() => toggleItem(index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}