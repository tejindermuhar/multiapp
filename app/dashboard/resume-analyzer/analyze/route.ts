// app/api/resume-analyzer/analyze/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const form = await req.formData()
  const resumeId = form.get('resume_id') as string
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: resume, error } = await supabase.from('resumes').select('*').eq('id', resumeId).single()
  if (error || !resume) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Signed URL to access private file
  const { data: signed, error: sErr } = await supabase
    .storage.from('resumes')
    .createSignedUrl(resume.file_path, 60)
  if (sErr) return NextResponse.json({ error: sErr.message }, { status: 500 })

  // Fetch the file and run your analyzer
  // const buf = await (await fetch(signed.signedUrl)).arrayBuffer()
  // TODO: parse PDF/DOCX and produce structured analysis_result here

  const analysis_result = { summary: 'Stub result — connect your parser/LLM here.' }

  const { error: upErr } = await supabase.from('resumes').update({ analysis_result }).eq('id', resumeId)
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })

  return NextResponse.json({ ok: true, analysis_result })
}
