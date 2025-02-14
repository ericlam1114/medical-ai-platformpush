// src/app/dashboard/scribe/page.js
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Mic, Download, Upload, Edit2, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AiScribe() {
  const [user, setUser] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [loading, setLoading] = useState(false)
  const [soapNotes, setSoapNotes] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState('')
  const [pronouns, setPronouns] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
        if (!session) {
          router.push('/login')
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
      }
    }

    checkUser()
  }, [router])

  // Speech recognition setup
  // Speech recognition setup
  const [recognition, setRecognition] = useState(null)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [micPermission, setMicPermission] = useState('prompt') // 'prompt', 'granted', 'denied'

  useEffect(() => {
    // Check for browser support
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      console.error('Media devices not supported')
      return
    }

    // Check microphone permission status
    navigator.permissions.query({ name: 'microphone' })
      .then(permissionStatus => {
        setMicPermission(permissionStatus.state)
        
        // Listen for permission changes
        permissionStatus.onchange = () => {
          setMicPermission(permissionStatus.state)
        }
      })
      .catch(err => console.error('Error checking permission:', err))

    // Initialize Web Speech API if available
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onresult = (event) => {
        let interimTranscript = ''
        let finalTranscript = transcript

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += ' ' + transcriptText
          } else {
            interimTranscript += transcriptText
          }
        }

        setTranscript(finalTranscript.trim())
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        if (event.error === 'not-allowed') {
          setMicPermission('denied')
        }
        setIsRecording(false)
      }

      setRecognition(recognition)
    }
  }, [transcript])

  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setMicPermission('granted')
      
      // Initialize media recorder with the stream
      const recorder = new MediaRecorder(stream)
      recorder.ondataavailable = handleAudioData
      setMediaRecorder(recorder)
      
      return true
    } catch (error) {
      console.error('Error accessing microphone:', error)
      setMicPermission('denied')
      setError('Microphone access is required for recording. Please allow microphone access in your browser settings.')
      return false
    }
  }

  const handleAudioData = (event) => {
    if (event.data.size > 0) {
      // Here you could implement audio processing or storage
      console.log('Audio data available:', event.data)
    }
  }

  const startRecording = async () => {
    setError(null)

    // Check if we already have permission
    if (micPermission !== 'granted') {
      const permitted = await requestMicrophoneAccess()
      if (!permitted) return
    }

    // Start recording
    try {
      if (recognition && mediaRecorder) {
        setIsRecording(true)
        recognition.start()
        mediaRecorder.start()
      } else {
        setError('Speech recognition is not supported in this browser. You can still type your notes manually.')
      }
    } catch (error) {
      console.error('Error starting recording:', error)
      setError('Failed to start recording. Please try again.')
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    try {
      if (recognition && mediaRecorder) {
        recognition.stop()
        mediaRecorder.stop()
      }
    } catch (error) {
      console.error('Error stopping recording:', error)
    }
    setIsRecording(false)
  }

  const generateSoapNotes = async () => {
    if (!transcript.trim()) {
      alert('Please record or enter some text first')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/generate-soap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          patientInfo: {
            patient: selectedPatient,
            pronouns,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate SOAP notes')
      }

      const data = await response.json()
      
      // Split the AI response into SOAP sections
      const sections = data.soapNotes.content.split('\n\n')
      const formattedNotes = {
        subjective: sections[0] || '',
        objective: sections[1] || '',
        assessment: sections[2] || '',
        plan: sections[3] || ''
      }

      setSoapNotes(formattedNotes)
    } catch (error) {
      console.error('Error generating SOAP notes:', error)
      alert('Error generating SOAP notes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const exportToPDF = async () => {
    const element = document.getElementById('soap-notes')
    if (!element) return

    try {
      // Create a new PDF
      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      })

      // Add header
      pdf.setFontSize(20)
      pdf.text('SOAP Notes', 20, 20)
      
      // Add metadata
      pdf.setFontSize(12)
      pdf.text(`Patient: ${selectedPatient}`, 20, 30)
      pdf.text(`Date: ${formatDate(new Date())}`, 20, 37)
      
      // Add SOAP sections
      let yPosition = 50
      const sections = ['Subjective', 'Objective', 'Assessment', 'Plan']
      
      sections.forEach((section) => {
        // Add section header
        pdf.setFontSize(14)
        pdf.setFont(undefined, 'bold')
        pdf.text(section, 20, yPosition)
        yPosition += 7

        // Add section content
        pdf.setFontSize(12)
        pdf.setFont(undefined, 'normal')
        const content = soapNotes[section.toLowerCase()]
        const lines = pdf.splitTextToSize(content, 170) // Split text to fit page width
        pdf.text(lines, 20, yPosition)
        yPosition += (lines.length * 7) + 10

        // Add some spacing between sections
        yPosition += 5
      })

      // Save the PDF
      pdf.save(`SOAP_Notes_${selectedPatient}_${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Error exporting PDF. Please try again.')
    }
  }

  return (<div>
        <Navbar />
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">AI Medical Scribe</h1>
          </div>
          <button 
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Recording Interface */}
        <div className="space-y-6">
          {/* Patient Selection */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Add or select patient"
                className="flex-1 px-4 py-2 border border-gray-200 rounded-md"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
              />
              <select 
                className="px-4 py-2 border border-gray-200 rounded-md"
                value={pronouns}
                onChange={(e) => setPronouns(e.target.value)}
              >
                <option value="">Select pronouns</option>
                <option value="he/him">He/Him</option>
                <option value="she/her">She/Her</option>
                <option value="they/them">They/Them</option>
              </select>
            </div>
          </div>

          {/* Recording Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex justify-center mb-6">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-4 rounded-full ${
                  isRecording 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                <Mic className="w-6 h-6" />
              </button>
            </div>
            <textarea
              className="w-full h-64 p-4 border border-gray-200 rounded-lg"
              placeholder="Transcript will appear here... You can also type directly"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={generateSoapNotes}
                disabled={loading}
                className="px-4 py-2 bg-[#0084C7] text-white rounded-lg hover:bg-[#0084C7]/90 disabled:opacity-50"
              >
                {loading ? 'Generating...' : 'Generate SOAP Notes'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - SOAP Notes */}
        <div id="soap-notes" className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">SOAP Notes</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Edit
                </>
              )}
            </button>
          </div>
          
          {/* SOAP Notes Sections */}
          {['Subjective', 'Objective', 'Assessment', 'Plan'].map((section) => (
            <div key={section} className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                {section}
              </h3>
              {isEditing ? (
                <textarea
                  className="w-full h-32 p-3 border border-gray-200 rounded-md"
                  value={soapNotes[section.toLowerCase()]}
                  onChange={(e) => 
                    setSoapNotes({
                      ...soapNotes,
                      [section.toLowerCase()]: e.target.value
                    })
                  }
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md min-h-[8rem] whitespace-pre-wrap">
                  {soapNotes[section.toLowerCase()]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      </div>
      <Footer />
    </div>
  )
}