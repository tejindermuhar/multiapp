// lib/puter.ts

// Simple AI analysis function - no zustand needed
export const analyzeResumeWithPuterAI = async (
  resumeText: string,
  jobTitle?: string,
  jobDescription?: string
) => {
  const instructions = `
You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze the following resume and provide detailed feedback.

${jobTitle ? `Target Job Title: ${jobTitle}` : ''}
${jobDescription ? `Job Description: ${jobDescription}` : ''}

Resume Content:
${resumeText}

Please provide a comprehensive analysis in the following JSON format:
{
  "score": <number 0-100>,
  "summary": "<brief overview>",
  "overallScore": <number 0-100>,
  "ATS": {
    "score": <number 0-100>,
    "tips": [
      { "type": "good" | "improve", "tip": "<tip text>" }
    ]
  },
  "toneAndStyle": {
    "score": <number 0-100>,
    "tips": [
      { "type": "good" | "improve", "tip": "<tip name>", "explanation": "<detailed explanation>" }
    ]
  },
  "content": {
    "score": <number 0-100>,
    "tips": [
      { "type": "good" | "improve", "tip": "<tip name>", "explanation": "<detailed explanation>" }
    ]
  },
  "structure": {
    "score": <number 0-100>,
    "tips": [
      { "type": "good" | "improve", "tip": "<tip name>", "explanation": "<detailed explanation>" }
    ]
  },
  "skills": {
    "score": <number 0-100>,
    "tips": [
      { "type": "good" | "improve", "tip": "<tip name>", "explanation": "<detailed explanation>" }
    ]
  },
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "improvements": ["<improvement 1>", "<improvement 2>", ...],
  "keywords": {
    "missing": ["<missing keyword 1>", ...],
    "present": ["<present keyword 1>", ...]
  },
  "sections": {
    "experience": "<feedback on experience section>",
    "education": "<feedback on education section>",
    "skills": "<feedback on skills section>"
  },
  "atsCompatibility": "<analysis of ATS compatibility>"
}

Provide actionable, specific feedback to help improve the resume for ATS systems and human recruiters.
`

  try {
    const response = await puter.ai.txt2txt(instructions, {
      model: 'claude-3.5-sonnet',
    })
    
    return JSON.parse(response)
  } catch (error) {
    console.error('Puter AI analysis failed:', error)
    throw error
  }
}

export default puter
