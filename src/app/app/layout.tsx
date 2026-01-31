import { redirect } from 'next/navigation'
import AppShell from '@/components/AppShell'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('full_name,agency_name').eq('id', user.id).maybeSingle()
  const { data: sub } = await supabase.from('subscriptions').select('*').eq('owner_id', user.id).maybeSingle()

  const subscribed = sub?.status === 'active' || sub?.status === 'trialing'
  const userLabel = profile?.agency_name
    ? `${profile.agency_name} · ${profile?.full_name || user.email}`
    : (profile?.full_name || user.email || '')

  return (
    <AppShell userLabel={userLabel} subscribed={subscribed}>
      {children}
    </AppShell>
  )
}
