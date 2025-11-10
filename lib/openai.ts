// lib/openai.ts
import OpenAI from 'openai'

// Check if API key exists
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY is not set in environment variables')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export const prepareInstructions = ({
  jobTitle,
  jobDescription,
}: {
  jobTitle?: string
  jobDescription?: string
}) => {
  return `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze this resume and provide detailed, actionable feedback.

${jobTitle ? `Target Job Title: ${jobTitle}` : ''}
${jobDescription ? `Job Description: ${jobDescription}` : ''}

Provide your analysis in this EXACT JSON format (no markdown, just pure JSON):
{
  "score": 75,
  "summary": "Brief 2-3 sentence overview of the resume quality and key strengths",
  "overallScore": 75,
  "ATS": {
    "score": 72,
    "tips": [
      { "type": "good", "tip": "Specific positive aspect about ATS compatibility" },
      { "type": "improve", "tip": "Specific improvement needed for better ATS parsing" }
    ]
  },
  "toneAndStyle": {
    "score": 80,
    "tips": [
      { "type": "good", "tip": "Professional language", "explanation": "Detailed explanation of what's working well" },
      { "type": "improve", "tip": "Action verbs", "explanation": "Detailed explanation of how to improve" }
    ]
  },
  "content": {
    "score": 70,
    "tips": [
      { "type": "good", "tip": "Relevant experience", "explanation": "Detailed explanation" },
      { "type": "improve", "tip": "Quantify achievements", "explanation": "Detailed explanation" }
    ]
  },
  "structure": {
    "score": 78,
    "tips": [
      { "type": "good", "tip": "Clear sections", "explanation": "Detailed explanation" },
      { "type": "improve", "tip": "Length", "explanation": "Detailed explanation" }
    ]
  },
  "skills": {
    "score": 68,
    "tips": [
      { "type": "good", "tip": "Technical skills listed", "explanation": "Detailed explanation" },
      { "type": "improve", "tip": "Soft skills", "explanation": "Detailed explanation" }
    ]
  },
  "strengths": ["Specific strength 1", "Specific strength 2", "Specific strength 3"],
  "improvements": ["Specific improvement 1", "Specific improvement 2", "Specific improvement 3"],
  "keywords": {
    "present": ["Keyword1", "Keyword2", "Keyword3"],
    "missing": ["MissingKeyword1", "MissingKeyword2", "MissingKeyword3"]
  },
  "sections": {
    "experience": "Detailed feedback on experience section - what's good and what needs improvement",
    "education": "Detailed feedback on education section",
    "skills": "Detailed feedback on skills section"
  },
  "atsCompatibility": "Overall analysis of how well this resume will perform in ATS systems"
}

Be specific, actionable, and honest. Provide real value.`
}

export const analyzeResumeWithOpenAI = async (
  resumeText: string,
  jobTitle?: string,
  jobDescription?: string
) => {
  console.log('🔵 Starting OpenAI analysis...')
  console.log('API Key exists:', !!process.env.OPENAI_API_KEY)
  console.log('Resume text length:', resumeText.length)

  const instructions = prepareInstructions({ jobTitle, jobDescription })

  try {
    console.log('📤 Calling OpenAI API...')
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using cheaper/faster model for testing
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume analyzer specializing in ATS optimization and career coaching. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: `${instructions}\n\nResume Content:\n${resumeText}`,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    console.log('✅ OpenAI response received')
    console.log('Response:', completion.choices[0].message.content?.substring(0, 200))

    const feedbackText = completion.choices[0].message.content
    if (!feedbackText) {
      throw new Error('OpenAI returned empty response')
    }

    const feedback = JSON.parse(feedbackText)
    console.log('✅ Feedback parsed successfully')
    
    return feedback
  } catch (error: any) {
    console.error('❌ OpenAI analysis error:')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error code:', error.code)
    console.error('Full error:', error)
    
    if (error.response) {
      console.error('API Response error:', error.response.data)
    }
    
    throw new Error('Failed to analyze resume with OpenAI: ' + error.message)
  }
}
