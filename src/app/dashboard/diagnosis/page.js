// src/app/dashboard/diagnosis/page.js
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Plus, X, Loader2, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react'
import DashboardNav from '@/components/DashboardNav'

export default function DiagnosisAssistant() {
  const [symptoms, setSymptoms] = useState([])
  const [currentSymptom, setCurrentSymptom] = useState('')
  const [loading, setLoading] = useState(false)
  const [diagnosis, setDiagnosis] = useState(null)
  const [error, setError] = useState(null)
  const [patientDetails, setPatientDetails] = useState({
    age: '',
    gender: '',
    history: ''
  })

  const handleAddSymptom = (e) => {
    e.preventDefault()
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()])
      setCurrentSymptom('')
    }
  }

  const removeSymptom = (symptomToRemove) => {
    setSymptoms(symptoms.filter(s => s !== symptomToRemove))
  }

  const handleGenerateDiagnosis = async () => {
    if (symptoms.length === 0) {
      setError('Please add at least one symptom')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms,
          patientDetails
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate diagnosis')
      }

      const data = await response.json()
      setDiagnosis(data)
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to generate diagnosis. Please try again.')
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
            <h1 className="text-2xl font-bold text-gray-900">Diagnosis Assistant</h1>
            <p className="mt-1 text-gray-600">Generate differential diagnoses based on symptoms and patient information.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Patient Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={patientDetails.age}
                    onChange={(e) => setPatientDetails({...patientDetails, age: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0084C7]"
                    placeholder="Enter age"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={patientDetails.gender}
                    onChange={(e) => setPatientDetails({...patientDetails, gender: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0084C7]"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relevant Medical History
                  </label>
                  <textarea
                    value={patientDetails.history}
                    onChange={(e) => setPatientDetails({...patientDetails, history: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0084C7]"
                    rows="3"
                    placeholder="Enter relevant medical history"
                  />
                </div>
              </div>
            </div>

            {/* Symptoms Input */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Symptoms</h2>
              <form onSubmit={handleAddSymptom} className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentSymptom}
                    onChange={(e) => setCurrentSymptom(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0084C7]"
                    placeholder="Enter a symptom"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-[#0084C7] text-white rounded-md hover:bg-[#0084C7]/90 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* Symptoms List */}
              <div className="space-y-2">
                {symptoms.map((symptom, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                  >
                    <span className="text-sm text-gray-600">{symptom}</span>
                    <button
                      onClick={() => removeSymptom(symptom)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleGenerateDiagnosis}
                disabled={loading || symptoms.length === 0}
                className="mt-6 w-full bg-[#0084C7] text-white px-4 py-2 rounded-lg hover:bg-[#0084C7]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Differential Diagnosis
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {diagnosis && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Differential Diagnosis</h2>
                
                {/* Primary Diagnoses */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Most Likely Diagnoses</h3>
                  <div className="space-y-3">
                    {diagnosis.primary?.map((dx, index) => (
                      <div key={index} className="flex items-start gap-3 bg-green-50 p-3 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{dx.condition}</h4>
                          <p className="text-sm text-gray-600 mt-1">{dx.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alternative Diagnoses */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Alternative Considerations</h3>
                  <div className="space-y-3">
                    {diagnosis.alternatives?.map((dx, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900">{dx.condition}</h4>
                        <p className="text-sm text-gray-600 mt-1">{dx.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Recommended Workup</h3>
                  <ul className="space-y-2">
                    {diagnosis.recommendations?.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-[#0084C7]">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}