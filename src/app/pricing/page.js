'use client'

import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
// import DashboardNav from '@/components/DashboardNav'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'

export default function Pricing() {
  const [annual, setAnnual] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (error) {
        console.error('Error checking auth status:', error)
      }
    }

    checkUser()
  }, [])

  const plans = [
    {
      name: 'Solo Practice',
      price: annual ? 999 : 99,
      description: 'Perfect for independent physicians',
      features: [
        'Up to 100 visits per month',
        'Voice-to-SOAP note conversion',
        'Basic clinical decision support',
        'Lab result analysis',
        'Standard support',
      ],
      cta: user ? 'Upgrade Plan' : 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      price: annual ? 1999 : 199,
      description: 'Ideal for busy practitioners',
      features: [
        'Unlimited visits',
        'Advanced clinical analysis',
        'Priority support',
        'Custom templates',
        'Team collaboration',
        'Analytics dashboard',
        'Detailed patient history'
      ],
      cta: user ? 'Upgrade Plan' : 'Get Started',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For medical groups & hospitals',
      features: [
        'Custom visit volume',
        'Enterprise SSO',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated support',
        'Training & onboarding',
        'SLA guarantees',
        'HIPAA compliance'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gray-50">
        <main>
          {/* Hero Section with Animated Background */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-blue-50 bg-gradient-size animate-gradient"></div>
            <div className="absolute inset-0 opacity-50 bg-[url('/grid.svg')]"></div>
            <div className="relative py-20">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Simple, Transparent Pricing
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Choose the plan that best fits your practice
                </p>
              </div>

              {/* Billing Toggle */}
              <div className="flex justify-center mb-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAnnual(false)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        !annual 
                          ? 'bg-[#0084C7] text-white' 
                          : 'text-gray-600 hover:text-[#0084C7]'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setAnnual(true)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        annual 
                          ? 'bg-[#0084C7] text-white' 
                          : 'text-gray-600 hover:text-[#0084C7]'
                      }`}
                    >
                      Annual
                      {annual && <span className="ml-2 text-xs">Save 20%</span>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rest of the content */}
          <div className="bg-gray-50">
            {/* Pricing Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`relative bg-white rounded-xl shadow-sm transition-all hover:shadow-lg ${
                      plan.popular ? 'border-2 border-[#0084C7]' : 'border border-gray-200'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <div className="bg-[#0084C7] text-white px-3 py-1 rounded-full text-sm font-medium">
                          Most Popular
                        </div>
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {plan.description}
                      </p>
                      <div className="mb-6">
                        {typeof plan.price === 'number' ? (
                          <div className="flex items-baseline">
                            <span className="text-4xl font-bold text-gray-900">
                              ${plan.price}
                            </span>
                            <span className="text-gray-600 ml-2">
                              /{annual ? 'year' : 'month'}
                            </span>
                          </div>
                        ) : (
                          <div className="text-4xl font-bold text-gray-900">
                            {plan.price}
                          </div>
                        )}
                      </div>

                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[#0084C7] mt-0.5" />
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Link
                        href={plan.name === 'Enterprise' ? '/contact' : user ? '/dashboard/settings' : '/signup'}
                        className={`block w-full text-center px-6 py-3 rounded-lg font-medium transition-colors ${
                          plan.popular
                            ? 'bg-[#0084C7] text-white hover:bg-[#0084C7]/90'
                            : 'bg-white text-[#0084C7] border-2 border-[#0084C7] hover:bg-[#0084C7]/5'
                        }`}
                      >
                        {plan.cta}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Is there a free trial?
                  </h3>
                  <p className="text-gray-600">
                    Yes, you can try our service free for 14 days. No credit card required.
                  </p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Can I change plans later?
                  </h3>
                  <p className="text-gray-600">
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of the next billing cycle.
                  </p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Is my data secure?
                  </h3>
                  <p className="text-gray-600">
                    Yes, we are fully HIPAA compliant and use industry-leading security measures to protect your data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
