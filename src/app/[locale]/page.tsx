'use client'

import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Analytics from '@/components/Analytics'
import UseCases from '@/components/UseCases'
import CaseStudies from '@/components/CaseStudies'
import Statistics from '@/components/Statistics'
import Features from '@/components/Features'
import Testimonials from '@/components/Testimonials'
import Security from '@/components/Security'
import FAQ from '@/components/FAQ'
import CTASection from '@/components/CTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-white w-full max-w-full overflow-x-hidden">
      <Header />
      <Hero />
      <Analytics />
      <UseCases />
      {/* <CaseStudies /> */}
      <Security />
      <Features />
      {/* <Testimonials /> */}
      <Statistics />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  )
}