// app/dashboard/resume-analyzer/[id]/ResumeViewer.tsx
'use client'

export default function ResumeViewer({ 
  resumeUrl, 
  fileName 
}: { 
  resumeUrl: string
  fileName: string 
}) {
  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
        {resumeUrl ? (
          <iframe
            src={resumeUrl}
            title={fileName}
            className="w-full h-[85vh]"
          />
        ) : (
          <div className="flex items-center justify-center h-[85vh]">
            <p className="text-gray-500">Loading resume...</p>
          </div>
        )}
      </div>
    </div>
  )
}
