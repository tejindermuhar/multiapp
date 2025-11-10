// lib/puter.ts

declare global {
  interface Window {
    puter: any
  }
}

export const getPuter = () => {
  if (typeof window !== 'undefined' && window.puter) {
    return window.puter
  }
  return null
}

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
  "summary": "Brief 2-3 sentence overview",
  "overallScore": 75,
  "ATS": {
    "score": 72,
    "tips": [
      { "type": "good", "tip": "Specific tip" },
      { "type": "improve", "tip": "Specific tip" }
    ]
  },
  "toneAndStyle": {
    "score": 80,
    "tips": [
      { "type": "good", "tip": "Brief", "explanation": "Detailed" },
      { "type": "improve", "tip": "Brief", "explanation": "Detailed" }
    ]
  },
  "content": {
    "score": 70,
    "tips": [
      { "type": "good", "tip": "Brief", "explanation": "Detailed" },
      { "type": "improve", "tip": "Brief", "explanation": "Detailed" }
    ]
  },
  "structure": {
    "score": 78,
    "tips": [
      { "type": "good", "tip": "Brief", "explanation": "Detailed" },
      { "type": "improve", "tip": "Brief", "explanation": "Detailed" }
    ]
  },
  "skills": {
    "score": 68,
    "tips": [
      { "type": "good", "tip": "Brief", "explanation": "Detailed" },
      { "type": "improve", "tip": "Brief", "explanation": "Detailed" }
    ]
  },
  "streng
