// app/dashboard/resume-analyzer/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ScoreCircle from '@/app/dashboard/resume-analyzer/components/ScoreCircle'

export default async function ResumeAnalyzerPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: resumes, error } = await supabase
    .from('resumes')
    .select('*')
    .order('created_at', { ascending: false })

  const hasResumes = resumes && resumes.length > 0

  return (
    <main className="min-h-screen pt-0 flex flex-col bg-gray-50">
      {/* Enhanced Header with Gradient */}
      <header className="bg-gradient-to-r from-[#021f69] via-[#0a2f7a] to-[#021f69] shadow-xl sticky top-0 z-50">
        <div className="w-full max-w-[1200px] mx-auto px-6 py-5 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-xl group-hover:bg-white/20 transition-all duration-300 border border-white/10">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
            </div>
            <div>
              <span className="text-white text-xl font-bold tracking-tight">Resume Analyzer</span>
              <p className="text-blue-200 text-xs">AI-Powered Insights</p>
            </div>
          </Link>
          
          <Link
            href="/dashboard/resume-analyzer/upload"
            className="group relative px-6 py-2.5 bg-gradient-to-r from-[#CE2D4F] via-[#E63946] to-[#CE2D4F] text-white font-semibold rounded-full shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Resume
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#E63946] via-[#FF4757] to-[#E63946] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <section className="flex flex-col items-center justify-center flex-1 px-6 py-16">
        <div className="w-full max-w-[1200px] mx-auto">
          
          {/* Hero Title Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              AI-Powered Analysis
            </div>
            
            <h1 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-4xl md:text-5xl lg:text-6xl leading-tight mb-4">
              Track Your Applications & Resume Ratings
            </h1>
          </div>

          {/* Empty State */}
          {!hasResumes ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative mb-10">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-12 rounded-3xl shadow-2xl border border-blue-100">
                  <svg className="w-32 h-32 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-3">No Resumes Yet</h3>
              <p className="text-lg text-gray-600 mb-10 text-center max-w-md">
                Upload your first resume to get instant AI-powered feedback and land your dream job
              </p>
              
              <Link
                href="/dashboard/resume-analyzer/upload"
                className="group px-10 py-4 bg-gradient-to-r from-[#CE2D4F] via-[#E63946] to-[#FF4757] text-white text-lg font-bold rounded-full shadow-2xl shadow-red-500/40 hover:shadow-red-500/60 transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Your First Resume
                </span>
              </Link>
            </div>
          ) : (
            <>
              {/* Subtitle */}
              <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl mx-auto">
                Review your submissions and check AI-powered feedback.
              </p>
              
              {/* Resume Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resumes.map((resume, index) => (
                  <div
                    key={resume.id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 hover:border-blue-300 hover:scale-105 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative p-6">
                      {/* Status Badge */}
                      <div className="flex justify-end mb-4">
                        {resume.feedback?.score ? (
                          <div className="px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
                            <span className="text-xs font-semibold text-green-700 flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Analyzed
                            </span>
                          </div>
                        ) : (
                          <div className="px-3 py-1.5 bg-gray-100 rounded-full">
                            <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Pending
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Company Icon */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>

                      {/* Company Info */}
                      <div className="mb-6">
                        {resume.company_name && (
                          <h3 className="font-bold text-gray-900 text-xl mb-1.5 truncate group-hover:text-blue-600 transition-colors">
                            {resume.company_name}
                          </h3>
                        )}
                        {resume.job_title && (
                          <p className="text-gray-600 text-base truncate">
                            {resume.job_title}
                          </p>
                        )}
                        {!resume.company_name && !resume.job_title && (
                          <h3 className="font-bold text-gray-900 text-lg truncate">
                            {resume.image_path}
                          </h3>
                        )}
                      </div>

                      {/* Score Circle */}
                      <div className="flex justify-center mb-6">
                        {resume.feedback?.score ? (
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity animate-pulse"></div>
                            <ScoreCircle score={resume.feedback.score} />
                          </div>
                        ) : (
                          <div className="w-[100px] h-[100px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-full border-4 border-dashed border-gray-300">
                            <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs text-gray-500 font-semibold">Pending</span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <Link
                        href={`/dashboard/resume-analyzer/${resume.id}`}
                        className="block w-full px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-purple-50 text-gray-700 hover:text-blue-600 font-semibold rounded-xl transition-all duration-300 text-center border border-gray-200 hover:border-blue-300 group-hover:scale-105"
                      >
                        <span className="flex items-center justify-center gap-2">
                          View Details
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Simple Footer - No gradient */}
      <footer className="bg-gray-900 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center">
          <p className="text-gray-400 text-base">© 2025 Resume Analyzer. Empowering careers with AI.</p>
        </div>
      </footer>
    </main>
  )
}
