// src/app/api/generate-soap/route.js
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { transcript, patientInfo } = await request.json()

    const response = await fetch('https://api.proai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert medical scribe who creates accurate and detailed SOAP notes from medical consultation transcripts. 
            Format your response in four clearly separated sections:

            1. Subjective: Patient's symptoms, complaints, and history as reported by them
            2. Objective: Observable findings, vital signs, physical examination results
            3. Assessment: Diagnosis or clinical impression based on subjective and objective data
            4. Plan: Treatment plan, medications, follow-up instructions

            Keep each section concise but comprehensive. Use professional medical terminology while maintaining clarity.`
          },
          {
            role: "user",
            content: `Generate detailed SOAP notes from the following consultation:
            
            Patient Information: ${JSON.stringify(patientInfo)}
            
            Consultation Transcript:
            ${transcript}
            
            Format the response with clear section headers and professional medical terminology.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      throw new Error('OpenAI API call failed')
    }

    const data = await response.json()
    
    // Extract the SOAP sections from the AI response
    // You'll need to adjust this based on how you format the output
    const soapNotes = {
      subjective: data.choices[0].message.content,
      objective: "",
      assessment: "",
      plan: ""
    }

    return NextResponse.json({ soapNotes })
  } catch (error) {
    console.error('Error generating SOAP notes:', error)
    return NextResponse.json(
      { error: 'Failed to generate SOAP notes' },
      { status: 500 }
    )
  }
}