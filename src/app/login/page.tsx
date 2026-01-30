'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = useMemo(() => (typeof window === 'undefined' ? null : createSupabaseBrowserClient()), [])
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [nextPath, setNextPath] = useState('/app')

  // Avoid useSearchParams to keep /login prerender-safe
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    setNextPath(sp.get('next') || '/app')
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!supabase) throw new Error('App not ready')

      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        })
        if (signUpError) throw signUpError
        router.push('/onboarding')
        return
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) throw signInError
      router.push(nextPath)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-md flex-col px-6 py-16">
        <h1 className="text-2xl font-semibold">{mode === 'login' ? 'Log in' : 'Create your account'}</h1>
        <p className="mt-2 text-sm text-slate-600">Use email + password. (No PHI.)</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3 rounded-xl border border-slate-200 bg-white p-5">
          {mode === 'signup' ? (
            <div>
              <label className="text-sm font-medium">Full name</label>
              <input
                className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Agent"
              />
            </div>
          ) : null}

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@agency.com"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error ? <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? 'Working…' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>

          <div className="text-center text-sm text-slate-600">
            {mode === 'login' ? (
              <button type="button" className="underline" onClick={() => setMode('signup')}>
                Need an account?
              </button>
            ) : (
              <button type="button" className="underline" onClick={() => setMode('login')}>
                Already have an account?
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  )
}
