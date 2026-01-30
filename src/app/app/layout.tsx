import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('full_name,agency_name').eq('id', user.id).maybeSingle()
  const { data: sub } = await supabase.from('subscriptions').select('*').eq('owner_id', user.id).maybeSingle()

  const active = sub?.status === 'active' || sub?.status === 'trialing'

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <Link href="/app" className="font-semibold">
              QuoteFlow
            </Link>
            <nav className="flex gap-3 text-sm text-slate-600">
              <Link className="hover:text-slate-900" href="/app">
                Today
              </Link>
              <Link className="hover:text-slate-900" href="/app/leads">
                Prospects
              </Link>
              <Link className="hover:text-slate-900" href="/app/import">
                Import
              </Link>
              <Link className="hover:text-slate-900" href="/app/templates">
                Scripts
              </Link>
              <Link className="hover:text-slate-900" href="/app/billing">
                Billing
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-sm text-slate-600 sm:block">
              {profile?.agency_name ? `${profile.agency_name} · ` : ''}
              {profile?.full_name || user.email}
            </div>
            <div className={`rounded-full px-2 py-1 text-xs ${active ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
              {active ? 'Subscribed' : 'Not subscribed'}
            </div>
            <form action="/logout" method="post">
              <button className="rounded-md border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50">Log out</button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  )
}
