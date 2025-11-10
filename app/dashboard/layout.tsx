// app/dashboard/layout.tsx
import { ReactNode } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Prefer full_name, fall back to other metadata or email local-part
  const displayName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.user_metadata?.user_name ??
    user.email?.split('@')[0] ??
    'User'

  async function signOut() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold flex items-center justify-center">
            A
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Aggregator
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{displayName}</p>
            {/* Optional subtitle: <p className="text-xs text-gray-500">{user.email}</p> */}
          </div>
          <form action={signOut}>
            <button className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50">
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Guard at the layout level so all nested pages are protected
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Shared header */}
      {await Header()}
      {/* Shared container */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {children}
      </main>
    </div>
  )
}
