// app/dashboard/resume-analyzer/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Summary from '@/components/resume/Summary'
import ATS from '@/components/resume/ATS'
import Details from '@/components/resume/Details'

export default async function ResumeDetail({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  const { data: resume, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !resume) {
    redirect('/dashboard/resume-analyzer')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-[#021f69] via-[#0a2f7a] to-[#021f69] shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Resume Analysis</h1>
                <p className="text-blue-200 text-xs">Detailed Insights</p>
              </div>
            </div>
            
            <Link
              href="/dashboard/resume-analyzer"
              className="group px-6 py-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-full transition-all duration-300 border border-white/20 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to All Resumes
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Card with Resume Info */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{resume.company_name || 'Resume Analysis'}</h2>
                  <p className="text-lg text-gray-600">{resume.job_title || resume.image_path}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="inline-flex">
                {resume.feedback ? (
                  <div className="px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
                    <span className="text-sm font-semibold text-green-700 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Analysis Complete
                    </span>
                  </div>
                ) : (
                  <div className="px-4 py-2 bg-orange-50 rounded-full border border-orange-200">
                    <span className="text-sm font-semibold text-orange-700 flex items-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Pending Analysis
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Score Display */}
            {resume.feedback?.score && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200 shadow-lg">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                      {resume.feedback.score}
                    </div>
                    <p className="text-sm font-semibold text-gray-600">Overall Score</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {resume.feedback.score >= 70 ? '🎉 Excellent!' : 
                       resume.feedback.score >= 50 ? '👍 Good' : '📈 Needs Work'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Resume Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Company</p>
              <p className="text-base font-bold text-gray-900">{resume.company_name || 'Not specified'}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">Position</p>
              <p className="text-base font-bold text-gray-900">{resume.job_title || 'Not specified'}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl border border-pink-200">
              <p className="text-xs font-semibold text-pink-600 uppercase tracking-wide mb-1">Uploaded</p>
              <p className="text-base font-bold text-gray-900">
                {new Date(resume.created_at).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Job Description */}
          {resume.job_description && (
            <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Job Description
              </h3>
              <p className="text-gray-700 leading-relaxed">{resume.job_description}</p>
            </div>
          )}
        </div>

        {/* Analysis Results Section */}
        {resume.feedback ? (
          <div className="space-y-6">
            {/* Summary Component */}
            <Summary feedback={resume.feedback} />
            
            {/* ATS Score Component */}
            <ATS 
              score={resume.feedback.ATS?.score || resume.feedback.score || 0} 
              suggestions={
                resume.feedback.ATS?.tips || 
                resume.feedback.improvements?.map((tip: string) => ({ 
                  type: 'improve' as const, 
                  tip 
                })) || 
                []
              } 
            />
            
            {/* Details Component with Accordions */}
            <Details feedback={resume.feedback} />
          </div>
        ) : (
          /* No Analysis State */
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-200">
            <div className="relative mb-8 inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-12 rounded-3xl">
                <svg className="w-32 h-32 text-blue-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-3">No Analysis Yet</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              This resume hasn't been analyzed. Click below to get instant AI-powered feedback.
            </p>
            
            <button
              onClick={() => {
                fetch('/api/analyze-resume', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ resumeId: id })
                }).then(() => window.location.reload())
              }}
              className="px-10 py-4 bg-gradient-to-r from-[#CE2D4F] via-[#E63946] to-[#FF4757] text-white text-lg font-bold rounded-full shadow-2xl shadow-red-500/40 hover:shadow-red-500/60 transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Analyze Now
              </span>
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative mt-16 overflow-hidden bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900">
        <div className="relative max-w-7xl mx-auto px-6 py-10 text-center">
          <p className="text-gray-300 text-base">© 2025 Resume Analyzer. Empowering careers with AI.</p>
        </div>
      </footer>
    </div>
  )
}
