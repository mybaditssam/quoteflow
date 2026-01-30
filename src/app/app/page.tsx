import { formatISO, startOfToday } from 'date-fns'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function TodayPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const today = startOfToday()
  const todayStr = formatISO(today, { representation: 'date' })

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('owner_id', user!.id)
    .lte('next_follow_up_date', todayStr)
    .order('next_follow_up_date', { ascending: true })
    .limit(50)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Today’s follow-ups</h1>
        <p className="mt-1 text-sm text-slate-600">Leads with next follow-up due on or before today.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4 text-sm text-slate-600">Due: {todayStr}</div>
        <div className="divide-y divide-slate-200">
          {(leads || []).length === 0 ? (
            <div className="p-6 text-sm text-slate-600">No follow-ups due. Nice.</div>
          ) : (
            leads!.map((l) => (
              <div key={l.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium">
                    {l.first_name} {l.last_name}
                  </div>
                  <div className="text-sm text-slate-600">
                    {l.phone || '—'} · {l.email || '—'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{l.status}</div>
                  <div className="text-xs text-slate-500">Next: {l.next_follow_up_date || '—'}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
