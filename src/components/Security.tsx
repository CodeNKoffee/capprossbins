'use client'

import { motion, Variants } from 'framer-motion'
import { Shield, Lock, /* Database, Key, */ UserCheck, Server, LucideIcon } from 'lucide-react'

const securityFeatures = [
  {
    icon: Shield,
    title: "SOC 2 Compliant",
    description: "Service Organization Control compliance ensuring your credit data meets the highest security standards"
  },
  // {
  //   icon: Database,
  //   title: "Self-Hosted Security",
  //   description: "Deploy CapprossBins on your own infrastructure. Complete control over your credit scoring data and models."
  // },
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All credit data and risk models protected with AES-256 encryption in transit and at rest."
  },
  {
    icon: UserCheck,
    title: "GDPR & CCPA Ready",
    description: "Built-in compliance features for handling personal financial data according to global privacy regulations."
  }
]

const complianceBadges = [
  { name: "SOC 2", icon: "🔒" },
  { name: "GDPR", icon: "🇪🇺" },
  { name: "CCPA", icon: "🏛" },
  // { name: "OSS", icon: "⚡" }
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

interface SecurityCardProps {
  icon: LucideIcon
  title: string
  description: string
}

const SecurityCard = ({ icon: Icon, title, description }: SecurityCardProps) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-emerald-500 transition-all duration-300 hover:shadow-xl"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
          <p className="text-gray-300 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function Security() {
  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-emerald-500" />
              <span className="text-emerald-500 font-medium">Security-first open source credit scoring</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Your credit data security is our top priority
            </h2>
            
            {/* <p className="text-gray-300 text-lg leading-relaxed mb-8">
              CapprossBins is built with enterprise-grade security for financial institutions. 
              Self-host on your infrastructure with complete data sovereignty and compliance controls.
            </p> */}
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              CapprossBins is built with enterprise-grade security for financial institutions.
              Your data stays protected with top-tier security, full compliance, and strict privacy controls — all managed by our expert team.
            </p>

            {/* Compliance Badges */}
            <div className="flex items-center gap-4">
              {complianceBadges.map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center shadow-lg"
                >
                  <span className="text-lg mb-1">{badge.icon}</span>
                  <span className="text-xs font-bold text-gray-800">{badge.name}</span>
                </motion.div>
              ))}
            </div>

            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 p-4 bg-gray-800 border border-gray-700 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <Server className="w-5 h-5 text-emerald-500" />
                <span className="text-emerald-500 font-medium text-sm">Open Source Advantage</span>
              </div>
              <p className="text-gray-300 text-sm">
                Audit our code, customize for your needs, and deploy with confidence. 
                No vendor lock-in, complete transparency.
              </p>
            </motion.div> */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 p-4 bg-gray-800 border border-gray-700 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <Server className="w-5 h-5 text-emerald-500" />
                <span className="text-emerald-500 font-medium text-sm">Fully Managed Service</span>
              </div>
              <p className="text-gray-300 text-sm">
                Let our team handle hosting, security, and maintenance so you can focus on what matters most.
                No setup headaches, no vendor lock-in — just a reliable, hassle-free experience.
              </p>
            </motion.div>
          </motion.div>

          {/* Right Content - Security Features Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6"
          >
            {securityFeatures.map((feature, index) => (
              <SecurityCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}