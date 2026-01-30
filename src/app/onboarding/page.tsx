import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

async function updateProfile(formData: FormData) {
  'use server'
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const full_name = String(formData.get('full_name') || '')
  const agency_name = String(formData.get('agency_name') || '')
  const timezone = String(formData.get('timezone') || 'UTC')

  await supabase
    .from('profiles')
    .upsert({ id: user.id, full_name, agency_name, timezone }, { onConflict: 'id' })

  redirect('/app')
}

export default async function OnboardingPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-xl px-6 py-14">
        <h1 className="text-2xl font-semibold">Welcome to QuoteFlow</h1>
        <p className="mt-2 text-sm text-slate-600">
          A quick setup to personalize your workspace. QuoteFlow is designed for agency workflows and stores contact info only—no PHI.
        </p>

        <form action={updateProfile} className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-white p-6">
          <div>
            <label className="text-sm font-medium">Full name</label>
            <input
              name="full_name"
              defaultValue={profile?.full_name ?? ''}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              placeholder="Alex Agent"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Agency name</label>
            <input
              name="agency_name"
              defaultValue={profile?.agency_name ?? ''}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              placeholder="Acme Insurance"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Timezone</label>
            <input
              name="timezone"
              defaultValue={profile?.timezone ?? 'UTC'}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2"
              placeholder="America/New_York"
            />
            <p className="mt-1 text-xs text-slate-500">Used to keep follow-up dates aligned with your day.</p>
          </div>

          <button className="rounded-md bg-slate-900 px-4 py-2 text-white">Continue</button>
        </form>
      </div>
    </main>
  )
}
