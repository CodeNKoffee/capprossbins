'use client'

import { motion, Variants } from 'framer-motion'
import { Linkedin } from 'lucide-react'
// import Image from 'next/image'

const testimonials = [
  {
    quote: "CapprossBins team listens to their users and build what they need. Thanks for solving a big pain point.",
    name: "Sarah Chen",
    title: "Head of Risk, FinTech Innovations (Series B)",
    // image: "/api/placeholder/80/80",
    linkedIn: "#"
  },
  {
    quote: "Love that CapprossBins is an Open Source! Very glad we switched and using it for our credit scoring models.",
    name: "Michael Rodriguez",
    title: "Risk Analytics Manager, Digital Bank Corp",
    // image: "/api/placeholder/80/80", 
    linkedIn: "#"
  },
  {
    quote: "Our transition to CapprossBins was smooth. We love the platform and data rooms with custom domains.",
    name: "Jennifer Park",
    title: "VP Risk Management, Credit Union Alliance",
    // image: "/api/placeholder/80/80",
    linkedIn: "#"
  }
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
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

interface TestimonialCardProps {
  quote: string
  name: string
  title: string
  // image: string
  linkedIn: string
}

const TestimonialCard = ({ quote, name, title, /* image, */ linkedIn }: TestimonialCardProps) => {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 h-full flex flex-col"
    >
      {/* Quote */}
      <blockquote className="text-gray-700 leading-relaxed mb-8 flex-grow">
        &quot;{quote}&quot;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-blue-200 to-purple-200 rounded-full"></div>
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-900">{name}</h4>
            <motion.a
              href={linkedIn}
              whileHover={{ scale: 1.1 }}
              className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              <Linkedin className="w-4 h-4" />
            </motion.a>
          </div>
          <p className="text-sm text-gray-600 mt-1">{title}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Loved by risk managers and data scientists around the world
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Here&apos;s what they have to say about us.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              quote={testimonial.quote}
              name={testimonial.name}
              title={testimonial.title}
              // image={testimonial.image}
              linkedIn={testimonial.linkedIn}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}