// app/dashboard/resume-analyzer/upload/page.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UploadResumePage() {
  const supabase = createClient()
  const router = useRouter()
  
  const [companyName, setCompanyName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusText, setStatusText] = useState('')
  const [error, setError] = useState('')

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files?.[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === 'application/pdf' && droppedFile.size <= 20 * 1024 * 1024) {
        setFile(droppedFile)
        setError('')
      } else {
        setError('Please upload a PDF file (max 20 MB)')
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' && selectedFile.size <= 20 * 1024 * 1024) {
        setFile(selectedFile)
        setError('')
      } else {
        setError('Please upload a PDF file (max 20 MB)')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError('Please upload a resume file')
      return
    }

    setIsProcessing(true)
    setError('')
    let resumeId = ''

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      setStatusText('Uploading the file...')
      const path = `${user.id}/${Date.now()}-${file.name}`

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(path, file)

      if (uploadError) throw uploadError

      setStatusText('Preparing data...')
      const { data: insertedResume, error: dbError } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          resume_path: path,
          image_path: file.name,
          company_name: companyName || null,
          job_title: jobTitle || null,
          job_description: jobDescription || null,
        })
        .select()
        .single()

      if (dbError) throw dbError
      resumeId = insertedResume.id

      setStatusText('Analyzing with AI...')
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Analysis failed')
      }

      setStatusText('Analysis complete! Redirecting...')

      setTimeout(() => {
        router.push(`/dashboard/resume-analyzer/${resumeId}`)
      }, 1000)

    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Upload failed. Please try again.')
      setIsProcessing(false)
      setStatusText('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-[#021f69] via-[#0a2f7a] to-[#021f69] shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <Link href="/dashboard/resume-analyzer" className="flex items-center gap-3 group">
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
              href="/dashboard/resume-analyzer"
              className="group px-6 py-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-full transition-all duration-300 border border-white/20 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                View All Resumes
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isProcessing ? (
          /* Processing State */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative bg-white p-12 rounded-3xl shadow-2xl">
                <div className="w-32 h-32 mx-auto">
                  <div className="animate-spin rounded-full h-32 w-32 border-8 border-blue-200 border-t-blue-600"></div>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{statusText}</h2>
            <p className="text-lg text-gray-600">Please wait while we process your resume...</p>
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Upload & Analyze
              </div>
              
              <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-4">
                Get Instant Feedback
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Drop your resume for an ATS score and improvement tips from our AI
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3 animate-fade-in-up">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Upload Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
                {/* Company Name */}
                <div className="mb-6">
                  <label htmlFor="company-name" className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Google, Microsoft, Amazon"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* Job Title */}
                <div className="mb-6">
                  <label htmlFor="job-title" className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Job Title
                  </label>
                  <input
                    type="text"
                    id="job-title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* Job Description */}
                <div className="mb-6">
                  <label htmlFor="job-description" className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                    <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Job Description
                  </label>
                  <textarea
                    rows={5}
                    id="job-description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-pink-100 focus:border-pink-500 transition-all outline-none resize-none text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Resume
                  </label>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative flex flex-col items-center justify-center text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 border-3 border-dashed transition-all duration-300 ${
                      dragActive 
                        ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="file"
                      id="fileUpload"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="fileUpload" className="cursor-pointer w-full">
                      {file ? (
                        <div className="space-y-4">
                          <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
                            <svg className="w-16 h-16 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-lg font-bold text-green-700 mb-1">{file.name}</p>
                            <p className="text-sm text-green-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <p className="text-sm text-gray-600">Click to change file</p>
                        </div>
                      ) : (
                        <>
                          <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="text-xl font-bold text-gray-900 mb-2">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-gray-600">PDF files only (max 20 MB)</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!file}
                className="w-full px-10 py-5 bg-gradient-to-r from-[#CE2D4F] via-[#E63946] to-[#FF4757] text-white text-xl font-bold rounded-2xl shadow-2xl shadow-red-500/40 hover:shadow-red-500/60 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
              >
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Analyze Resume with AI
                </span>
              </button>
            </form>

            {/* Features */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: '⚡', title: 'Instant Analysis', desc: 'Get feedback in seconds' },
                { icon: '🎯', title: 'ATS Optimized', desc: 'Beat applicant tracking systems' },
                { icon: '📈', title: 'Improve Chances', desc: 'Land more interviews' }
              ].map((feature, idx) => (
                <div key={idx} className="p-6 bg-white rounded-2xl shadow-md border border-gray-200 text-center">
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </>
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
