'use client'

import { motion, Variants } from 'framer-motion'
import { Settings, Eye, Palette, BarChart3, Bot, Server, LucideIcon } from 'lucide-react'

const features = [
  {
    icon: Settings,
    title: "Advanced Access Control",
    description: "Fine-tune who can view your credit models and binning results. Set time-based access and revoke permissions instantly."
  },
  {
    icon: Eye,
    title: "Real-time Model Monitoring",
    description: "Track model performance with live analytics. Get instant alerts on score drift and population changes."
  },
  {
    icon: Palette,
    title: "White-label Deployment",
    description: "Deploy with your brand identity. Custom domains, logos, and styling for seamless integration."
  },
  {
    icon: BarChart3,
    title: "Comprehensive Analytics",
    description: "Deep dive into binning performance, score distributions, and validation metrics with interactive dashboards."
  },
  {
    icon: Bot,
    title: "AI-Powered Insights",
    description: "Chat with your credit data using natural language. Get instant explanations of score decisions and model behavior."
  },
  {
    icon: Server,
    title: "Self-hosted Security",
    description: "Open-source platform you can deploy on your infrastructure. Complete data sovereignty and compliance control."
  }
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <motion.div
      variants={itemVariants}
      className="text-center group"
    >
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-200 transition-all duration-300"
      >
        <Icon className="w-8 h-8 text-emerald-600" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  )
}

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Built for credit risk teams.{' '}
            <span className="text-gray-500">
              Share your scoring models with confidence and control.
            </span>
          </h2>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}