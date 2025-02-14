// src/app/api/generate-diagnosis/route.js
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { symptoms, patientDetails } = await request.json()

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are an expert medical diagnosis assistant. Analyze the provided symptoms and patient information to generate a differential diagnosis. Structure your response with:
            1. Primary (most likely) diagnoses with explanations
            2. Alternative diagnoses to consider
            3. Recommended diagnostic workup

            Use professional medical terminology while keeping explanations clear and concise.
            Base your analysis on current medical evidence and guidelines.`
          },
          {
            role: "user",
            content: `Generate a differential diagnosis for the following case:

            Patient Information:
            Age: ${patientDetails.age}
            Gender: ${patientDetails.gender}
            Medical History: ${patientDetails.history}

            Presenting Symptoms:
            ${symptoms.join(', ')}

            Provide a structured differential diagnosis with explanations and recommended workup.`
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
    
    // Process and structure the response
    const formattedResponse = {
      primary: [
        {
          condition: "Primary Diagnosis 1",
          explanation: "Explanation of why this is likely"
        }
        // Add more based on the API response
      ],
      alternatives: [
        {
          condition: "Alternative Diagnosis 1",
          explanation: "Why this should be considered"
        }
        // Add more based on the API response
      ],
      recommendations: [
        "Recommended test 1",
        "Recommended test 2"
        // Add more based on the API response
      ]
    }

    return NextResponse.json(formattedResponse)
  } catch (error) {
    console.error('Error generating diagnosis:', error)
    return NextResponse.json(
      { error: 'Failed to generate diagnosis' },
      { status: 500 }
    )
  }
}