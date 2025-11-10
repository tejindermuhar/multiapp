// app/api/analyze-resume/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    console.log('=== Analysis API called ===')
    
    const { resumeId } = await req.json()
    console.log('Resume ID:', resumeId)
    
    if (!resumeId) {
      return NextResponse.json({ error: 'Resume ID is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    console.log('User authenticated:', user?.id)
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get resume from database
    console.log('Fetching resume from database...')
    const { data: resume, error: dbError } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Database error: ' + dbError.message }, { status: 500 })
    }

    if (!resume) {
      console.error('Resume not found')
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    console.log('Resume found:', resume.id)

    // Generate mock feedback
    console.log('Generating feedback...')
    const baseScore = Math.floor(Math.random() * 25) + 65 // Random score 65-90
    
    const feedback = {
      score: baseScore,
      summary: `This resume for ${resume.job_title || 'the position'} at ${resume.company_name || 'the company'} demonstrates strong professional experience. The structure is clear with well-defined sections. Consider adding more quantifiable achievements to strengthen the impact.`,
      overallScore: baseScore,
      ATS: {
        score: baseScore - 5,
        tips: [
          { type: "good", tip: "Clear section headers improve ATS readability" },
          { type: "good", tip: "Standard formatting helps with parsing" },
          { type: "improve", tip: "Add more industry-specific keywords" },
          { type: "improve", tip: "Include relevant certifications" }
        ]
      },
      toneAndStyle: {
        score: baseScore + 5,
        tips: [
          { type: "good", tip: "Professional language", explanation: "The resume maintains a professional tone throughout with appropriate terminology" },
          { type: "improve", tip: "Action verbs", explanation: "Start more bullet points with strong action verbs like 'Led', 'Developed', 'Implemented', 'Achieved'" }
        ]
      },
      content: {
        score: baseScore - 3,
        tips: [
          { type: "good", tip: "Relevant experience", explanation: "Your work experience aligns well with the target role and industry" },
          { type: "improve", tip: "Quantify achievements", explanation: "Add specific metrics and numbers to demonstrate impact (e.g., 'Increased revenue by 30%', 'Managed team of 10')" }
        ]
      },
      structure: {
        score: baseScore + 8,
        tips: [
          { type: "good", tip: "Clear sections", explanation: "Resume is well-organized with distinct, easy-to-find sections" },
          { type: "good", tip: "Logical flow", explanation: "Information is presented in a logical, chronological order" },
          { type: "improve", tip: "Conciseness", explanation: "Consider condensing to 1-2 pages for optimal readability" }
        ]
      },
      skills: {
        score: baseScore - 8,
        tips: [
          { type: "good", tip: "Technical skills listed", explanation: "Good coverage of relevant technical skills and tools" },
          { type: "improve", tip: "Soft skills", explanation: "Add more soft skills like communication, leadership, problem-solving" },
          { type: "improve", tip: "Skill proficiency", explanation: "Indicate proficiency level for each skill (e.g., Expert, Intermediate, Familiar)" }
        ]
      },
      strengths: [
        "Strong technical background in relevant technologies and tools",
        "Clear career progression demonstrating professional growth",
        "Relevant certifications that add credibility to qualifications",
        "Well-structured format with clear section organization"
      ],
      improvements: [
        "Add more quantifiable achievements with specific metrics and numbers",
        "Include additional industry-specific keywords for better ATS matching",
        "Expand soft skills section with leadership and communication abilities",
        "Add links to portfolio, GitHub, or LinkedIn profile"
      ],
      keywords: {
        present: ["JavaScript", "React", "Node.js", "Team Leadership", "Project Management", "Agile"],
        missing: ["CI/CD", "Cloud Architecture", "Microservices", "DevOps", "Docker", "Kubernetes"]
      },
      sections: {
        experience: "Your experience section effectively showcases your career progression. Each role includes relevant responsibilities. To strengthen it further, add specific accomplishments with measurable results for each position.",
        education: "Education section is well-presented with relevant degrees and institutions. Consider adding relevant coursework, academic achievements, or GPA if it strengthens your application.",
        skills: "Skills section provides good technical coverage. Enhance it by categorizing skills (e.g., Languages, Frameworks, Tools), adding proficiency levels, and including soft skills relevant to the target role."
      },
      atsCompatibility: "Your resume demonstrates good ATS compatibility with clear formatting, standard section headers, and readable fonts. To improve further, incorporate more role-specific keywords, avoid complex formatting elements, and ensure all text is machine-readable rather than embedded in images."
    }

    console.log('Feedback generated successfully')

    // Update resume with feedback
    console.log('Updating resume in database...')
    const { error: updateError } = await supabase
      .from('resumes')
      .update({ feedback })
      .eq('id', resumeId)

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Failed to save feedback: ' + updateError.message }, { status: 500 })
    }

    console.log('=== Analysis complete ===')
    return NextResponse.json({ success: true, feedback })
    
  } catch (error: any) {
    console.error('=== Analysis API Error ===')
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    
    return NextResponse.json(
      { 
        error: error.message || 'Analysis failed',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
