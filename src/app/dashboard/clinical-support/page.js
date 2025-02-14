// src/app/dashboard/clinical-support/page.js
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Search, Loader2, AlertCircle, Book, Calculator, Pill, Stethoscope } from 'lucide-react'
import DashboardNav from '@/components/DashboardNav'

export default function ClinicalSupport() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const categories = [
    {
      id: 'guidelines',
      name: 'Treatment Guidelines',
      icon: Book,
      description: 'Access evidence-based treatment protocols and guidelines',
      examples: ['Hypertension management', 'Type 2 diabetes treatment', 'Asthma control']
    },
    {
      id: 'medications',
      name: 'Drug Information',
      icon: Pill,
      description: 'Get detailed medication information and interactions',
      examples: ['Drug interactions', 'Dosing guidelines', 'Side effects']
    },
    {
      id: 'calculations',
      name: 'Clinical Calculations',
      icon: Calculator,
      description: 'Medical calculations and scoring systems',
      examples: ['BMI calculator', 'CHA2DS2-VASc score', 'MELD score']
    },
    {
      id: 'diagnosis',
      name: 'Diagnostic Support',
      icon: Stethoscope,
      description: 'Differential diagnosis and workup recommendations',
      examples: ['Chest pain workup', 'Anemia evaluation', 'Thyroid nodule']
    }
  ]

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/clinical-support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query,
          category: selectedCategory 
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get clinical support information')
      }

      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to get information. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <DashboardNav />
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900">Clinical Decision Support</h1>
            <p className="mt-1 text-gray-600">Get AI-powered clinical insights and evidence-based recommendations.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {/* Search Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your clinical question..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0084C7] focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="absolute right-2 top-2 p-2 bg-[#0084C7] text-white rounded-lg hover:bg-[#0084C7]/90 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`bg-white rounded-lg border p-6 text-left transition-all ${
                    selectedCategory === category.id
                      ? 'border-[#0084C7] ring-1 ring-[#0084C7]'
                      : 'border-gray-200 hover:border-[#0084C7]/20'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-2 rounded-lg ${
                      selectedCategory === category.id
                        ? 'bg-[#0084C7]/10 text-[#0084C7]'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {category.examples.map((example) => (
                      <span
                        key={example}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#0084C7]/10 text-[#0084C7]"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Results Section */}
          {results && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Results</h2>
              <div className="prose max-w-none">
                {/* Format and display results based on the selected category */}
                <div className="space-y-4">
                  {results.sections?.map((section, index) => (
                    <div key={index}>
                      <h3 className="text-md font-medium text-gray-900">{section.title}</h3>
                      <div className="mt-2 text-sm text-gray-600">{section.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}