'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function BillingPage() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.get('success')) setMessage('Subscription started. It can take a few seconds to reflect.')
    if (searchParams.get('canceled')) setMessage('Checkout canceled.')
  }, [searchParams])

  async function go(endpoint: string) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(endpoint, { method: 'POST' })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Request failed')
      window.location.href = json.url
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Billing</h1>
        <p className="mt-1 text-sm text-slate-600">Manage your subscription with Stripe.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="font-medium">QuoteFlow subscription</div>
        <p className="mt-1 text-sm text-slate-600">
          Start a subscription via Stripe Checkout. Then manage invoices/cancellation in the customer portal.
        </p>

        {message ? <div className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</div> : null}
        {error ? <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            disabled={loading}
            onClick={() => void go('/api/stripe/checkout')}
            className="rounded-md bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? 'Working…' : 'Subscribe'}
          </button>
          <button
            disabled={loading}
            onClick={() => void go('/api/stripe/portal')}
            className="rounded-md border border-slate-200 px-4 py-2 disabled:opacity-50"
          >
            Open customer portal
          </button>
        </div>

        <div className="mt-6 text-xs text-slate-500">
          Note: access gating is minimal in the MVP. Use subscription status for production gating.
        </div>
      </div>
    </div>
  )
}
