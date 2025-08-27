'use client'

import { motion, Variants } from 'framer-motion'
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { useState, useCallback } from 'react'
// import { useForm, ValidationError, SubmissionError } from '@formspree/react'

// Types
interface FormValues {
  email: string
}

interface SubmitStatus {
  type: 'success' | 'error' | null
  message?: string
}

interface AnimationConfig {
  container: Variants
  badge: Variants
  statusMessage: Variants
}

// Constants
const FORMSPREE_FORM_ID = 'xldwdjna' as const
const SUCCESS_MESSAGE_DURATION_MS = 5000
const ERROR_MESSAGE_DURATION_MS = 5000

// Validation schema with enhanced rules
const subscriptionSchema: Yup.Schema<FormValues> = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Invalid email format'
    )
    .max(254, 'Email address is too long')
    .required('Email is required')
    .trim()
})

// Animation configurations
const animationConfig: AnimationConfig = {
  container: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 }
  },
  badge: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  },
  statusMessage: {
    initial: { opacity: 0, y: 10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.95 }
  }
}

const CTASection: React.FC = () => {
  // Remove the Formspree hook since we're handling submission manually
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({ type: null })

  // Remove the useEffect since we're handling status in onSubmit

  const renderStatusMessage = useCallback(() => {
    if (!submitStatus.type) return null

    const isSuccess = submitStatus.type === 'success'
    const baseClasses = "mt-4 p-4 rounded-lg border text-sm font-medium"
    const statusClasses = isSuccess 
      ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
      : "bg-red-100 text-red-800 border-red-200"

    return (
      <motion.div
        variants={animationConfig.statusMessage}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`${baseClasses} ${statusClasses}`}
        role={isSuccess ? "status" : "alert"}
        aria-live={isSuccess ? "polite" : "assertive"}
      >
        {isSuccess ? '🎉 ' : '⚠️ '}
        {submitStatus.message || (isSuccess 
          ? 'Thanks for joining! We\'ll be in touch soon with updates.' 
          : 'Something went wrong. Please try again.')}
      </motion.div>
    )
  }, [submitStatus])

  return (
    <section 
      id="early-access" 
      className="py-24 bg-gradient-to-br from-emerald-600 via-emerald-700 to-gray-800 relative overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <motion.div
          variants={animationConfig.container}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            variants={animationConfig.badge}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <span 
              className="inline-block px-4 py-2 bg-emerald-500 bg-opacity-20 rounded-full text-emerald-100 text-sm font-medium mb-6"
              role="banner"
            >
              🚀 Ready for digital transformation?
            </span>
          </motion.div>

          <h2 
            id="cta-heading"
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Credit binning made secure,{' '}
            <span className="text-emerald-300">fast, and intelligent.</span>
          </h2>
          
          <p className="text-emerald-100 text-lg md:text-xl mb-10 max-w-3xl mx-auto">
            Start building better feature binning today.
          </p>
          
          {/* Enhanced Email Form */}
          <div className="max-w-2xl mx-auto mb-8">
            <Formik<FormValues>
              initialValues={{ email: '' }}
              validationSchema={subscriptionSchema}
              onSubmit={async (values: FormValues, helpers: FormikHelpers<FormValues>) => {
                try {
                  // Create a proper FormData object for Formspree
                  const formData = new FormData()
                  formData.append('email', values.email)
                  
                  const response = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                      'Accept': 'application/json'
                    }
                  })
                  
                  if (response.ok) {
                    setSubmitStatus({ 
                      type: 'success', 
                      message: 'Successfully joined the waitlist!' 
                    })
                    helpers.resetForm()
                    setTimeout(() => setSubmitStatus({ type: null }), SUCCESS_MESSAGE_DURATION_MS)
                  } else {
                    throw new Error('Submission failed')
                  }
                } catch (error) {
                  setSubmitStatus({ 
                    type: 'error', 
                    message: 'Something went wrong. Please try again.' 
                  })
                  setTimeout(() => setSubmitStatus({ type: null }), ERROR_MESSAGE_DURATION_MS)
                } finally {
                  helpers.setSubmitting(false)
                }
              }}
              validateOnChange={true}
              validateOnBlur={true}
            >
              {({ isSubmitting, errors, touched, values }) => (
                <Form>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-start w-full">
                    <div className="w-full sm:flex-1">
                      <Field
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        autoComplete="email"
                        aria-describedby={errors.email && touched.email ? "email-error" : undefined}
                        aria-invalid={!!(errors.email && touched.email)}
                        className={`w-full px-4 py-4 rounded-xl border-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all duration-200 ${
                          errors.email && touched.email 
                            ? 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-300' 
                            : 'border-white bg-white focus:border-emerald-400'
                        }`}
                      />
                      <ErrorMessage 
                        name="email" 
                        component="div" 
                        id="email-error"
                        className="text-red-200 text-sm mt-2 text-center"
                        aria-live="polite"
                      />
                      {/* Remove ValidationError since we're not using Formspree hook */}
                    </div>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || !values.email}
                      whileHover={!isSubmitting ? { 
                        scale: 1.05, 
                        backgroundColor: '#f3f4f6' 
                      } : {}}
                      whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                      className={`w-full sm:w-fit px-8 py-4 bg-white text-emerald-700 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-emerald-700 ${
                        isSubmitting || !values.email
                          ? 'opacity-75 cursor-not-allowed hover:bg-white' 
                          : 'hover:bg-gray-50'
                      }`}
                      aria-label={isSubmitting ? 'Joining waitlist...' : 'Join the waitlist'}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Joining...
                        </span>
                      ) : (
                        'Join the Waitlist →'
                      )}
                    </motion.button>
                  </div>
                </Form>
              )}
            </Formik>

            {/* Enhanced Status Messages */}
            {renderStatusMessage()}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-emerald-200 text-sm"
            role="contentinfo"
          >
            ✓ Managed by our team &nbsp;&nbsp; ✓ Reliable service, no setup needed
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection