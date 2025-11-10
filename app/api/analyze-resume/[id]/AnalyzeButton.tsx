// app/dashboard/resume-analyzer/[id]/AnalyzeButton.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AnalyzeButton({ resumeId }: { resumeId: string }) {
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleAnalyze = async () => {
    setAnalyzing(true)
    setError('')

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      // Refresh the page to show new feedback
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to analyze resume')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="mb-6">
      <button
        onClick={handleAnalyze}
        disabled={analyzing}
        className="px-6 py-3 bg-[#CE2D4F] hover:bg-[#b62646] text-white font-semibold rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {analyzing ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Analyzing with AI...
          </span>
        ) : 'Analyze Resume with AI'}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
