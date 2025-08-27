'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqData = [
  {
    question: "What is Credit Binning?",
    answer: "Credit binning is a statistical technique used to group credit applicants or accounts into distinct risk categories based on their credit characteristics. By segmenting customers into homogeneous groups, lenders can assess risk more effectively and apply tailored pricing strategies. Binning supports clearer decision-making and enhances model interpretability."
  },
  {
    question: "Why Smart Binning Still Matters in Data Science?",
    answer: "While often seen as a basic preprocessing step, binning is a strategic tool for improving model performance, interpretability, and business alignment. From credit scoring to churn prediction, smart binning helps transform raw data into structured, actionable insights—making models more transparent and decisions more defensible."
  },
  {
    question: "What CapprossBins Adds to the Table—and How the Platform Works?",
    answer: "Most binning tools struggle to balance statistical rigor with business logic. CapprossBins was built to solve that.\n\nThe platform simplifies binning through an intuitive interface. Upload your CSV file, select the feature to bin, and define your criteria. CapprossBins then automates the process by:\n\n• Starting with quantile-based (equal-frequency) bins\n• Displaying key statistics for each bin—population distribution, bad rate, WOE, IV, Gini coefficient, and Jensen-Shannon divergence\n• Enforcing business and statistical constraints, including:\n    ◦ Monotonic Bad-Rate Trend: Ensures logical risk progression\n    ◦ Class Balance: Prevents bins with only \"good\" or \"bad\" cases\n    ◦ Bin Population: Recommends 5%–50% of observations per bin\n    ◦ Business-Aligned Ranges: Ensures bins make sense for decision-making\n    ◦ Bad-Rate Consolidation: Merges adjacent bins with similar bad rates to reduce redundancy and preserve monotonicity\n\nCapprossBins helps users build interpretable, compliant, and stable models—without sacrificing flexibility."
  },
  {
    question: "Who Can Use CapprossBins?",
    answer: "CapprossBins is designed for credit risk professionals, data scientists, financial institutions, fintech companies, and anyone involved in credit scoring and risk modeling. Whether you're just learning about binning or building advanced scorecards, the platform adapts to your level of expertise."
  },
  {
    question: "Where Else Is Binning Used?",
    answer: "Binning is widely applied across industries that rely on segmentation and pattern recognition. These include:\n\n• Marketing analytics\n• Retail analytics\n• Quality control\n• Healthcare (e.g., patient risk stratification)\n• Financial risk assessment\n• Insurance and investment firms\n• Telecommunications\n\nIn each of these fields, binning helps organize data into meaningful groups—supporting better decisions, clearer reporting, and more robust models."
  },
  {
    question: "How do risk managers validate credit scoring models?",
    answer: "Model validation in credit scoring involves tracking key indicators to ensure the model remains accurate, stable, and compliant over time. This typically includes calculating metrics like the Population Stability Index (PSI) to detect shifts in input distributions, and the Characteristic Stability Index (CSI) to monitor changes in variable behavior. Ongoing performance monitoring—such as tracking AUC, KS, and bad rate—helps identify early signs of model drift. When thresholds are breached, automated alerts and structured validation reports can support timely intervention and regulatory review."
  }
]

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

const FAQItem = ({ question, answer, isOpen, onToggle }: FAQItemProps) => {
  const formatAnswer = (text: string) => {
    const lines = text.split('\n')
    const result = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const prevLine = lines[i - 1] || ''
      const nextLine = lines[i + 1] || ''
      
      // Check if current line is a bullet point
      const isBulletPoint = line.startsWith('• ') || line.trim().startsWith('◦ ')
      // Check if previous/next lines are bullet points
      const prevIsBulletPoint = prevLine.startsWith('• ') || prevLine.trim().startsWith('◦ ')
      const nextIsBulletPoint = nextLine.startsWith('• ') || nextLine.trim().startsWith('◦ ')
      
      // Add empty line before first bullet point in a list
      if (isBulletPoint && !prevIsBulletPoint && prevLine !== '') {
        result.push(<div key={`empty-before-${i}`} className="h-4"></div>)
      }
      
      // Main bullet points (•)
      if (line.startsWith('• ')) {
        result.push(
          <div key={i} className="pl-6 mb-2">
            {line}
          </div>
        )
      }
      // Sub bullet points (◦) with more indentation
      else if (line.trim().startsWith('◦ ')) {
        result.push(
          <div key={i} className="pl-12 mb-2">
            {line.trim()}
          </div>
        )
      }
      // Regular text - add spacing for non-empty lines
      else if (line.trim() !== '') {
        result.push(
          <div key={i} className="mb-4">
            {line}
          </div>
        )
      }
      // Empty lines
      else {
        result.push(
          <div key={i} className="h-4">
            {line}
          </div>
        )
      }
      
      // Add empty line after last bullet point in a list
      if (isBulletPoint && !nextIsBulletPoint && nextLine !== '') {
        result.push(<div key={`empty-after-${i}`} className="h-4"></div>)
      }
    }
    
    return result
  }

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
              {formatAnswer(answer)}
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