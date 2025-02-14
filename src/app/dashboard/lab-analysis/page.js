// src/app/dashboard/lab-analysis/page.js
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, FileText, AlertCircle, Loader2, Download, ChevronLeft } from 'lucide-react'
import DashboardNav from '@/components/DashboardNav'

export default function LabAnalysis() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.jpg') && !file.name.endsWith('.png')) {
      setError('Please upload a PDF or image file')
      return
    }

    setFile(file)
    setError(null)
  }

  const handleAnalysis = async () => {
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/analyze-labs', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze lab results')
      }

      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Error analyzing labs:', error)
      setError('Failed to analyze lab results. Please try again.')
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
            <h1 className="text-2xl font-bold text-gray-900">Lab Analysis Assistant</h1>
            <p className="mt-1 text-gray-600">Upload lab results for AI-powered analysis and interpretation.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {/* Upload Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload Lab Results</h2>
              <p className="text-sm text-gray-600">Upload your lab results as PDF or image files.</p>
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                id="lab-file"
              />
              <label
                htmlFor="lab-file"
                className="flex flex-col items-center cursor-pointer"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 mb-1">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </span>
                <span className="text-xs text-gray-500">
                  PDF, JPG, or PNG files
                </span>
              </label>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleAnalysis}
                disabled={!file || loading}
                className="bg-[#0084C7] text-white px-4 py-2 rounded-lg hover:bg-[#0084C7]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Analyze Results
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {results && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Analysis Results</h2>
                <button
                  onClick={() => {/* Add export functionality */}}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <Download className="w-5 h-5" />
                  Export Report
                </button>
              </div>

              <div className="space-y-6">
                {/* Summary Section */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Summary</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">{results.summary}</p>
                  </div>
                </div>

                {/* Abnormal Results */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Abnormal Results</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-4">
                      {results.abnormalResults?.map((result, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{result.test}</p>
                            <p className="text-sm text-gray-600">Value: {result.value}</p>
                            <p className="text-sm text-gray-600">Reference Range: {result.range}</p>
                            <p className="text-sm text-gray-500 mt-1">{result.interpretation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Recommendations</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <ul className="space-y-2">
                      {results.recommendations?.map((rec, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-[#0084C7]">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}