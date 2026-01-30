import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const STATUSES = ['New', 'Contacted', 'Quoted', 'Won', 'Lost']

async function createLead(formData: FormData) {
  'use server'
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const first_name = String(formData.get('first_name') || '')
  const last_name = String(formData.get('last_name') || '')
  const email = String(formData.get('email') || '')
  const phone = String(formData.get('phone') || '')
  const status = String(formData.get('status') || 'New')
  const next_follow_up_date = String(formData.get('next_follow_up_date') || '') || null

  await supabase.from('leads').insert({
    owner_id: user!.id,
    first_name,
    last_name,
    email,
    phone,
    status,
    next_follow_up_date,
  })

  revalidatePath('/app/leads')
}

async function updateLead(formData: FormData) {
  'use server'
  const supabase = await createSupabaseServerClient()
  const id = String(formData.get('id'))
  const status = String(formData.get('status') || 'New')
  const next_follow_up_date = String(formData.get('next_follow_up_date') || '') || null

  await supabase.from('leads').update({ status, next_follow_up_date }).eq('id', id)

  revalidatePath('/app/leads')
  revalidatePath('/app')
}

export default async function LeadsPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('owner_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(200)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Prospects</h1>
        <p className="mt-1 text-sm text-slate-600">Track status and set a next follow-up date for your pipeline.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="font-medium">Add prospect</div>
        <form action={createLead} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input name="first_name" className="rounded-md border border-slate-200 px-3 py-2" placeholder="First name" />
          <input name="last_name" className="rounded-md border border-slate-200 px-3 py-2" placeholder="Last name" />
          <input name="email" className="rounded-md border border-slate-200 px-3 py-2" placeholder="Email" />
          <input name="phone" className="rounded-md border border-slate-200 px-3 py-2" placeholder="Phone" />
          <select name="status" className="rounded-md border border-slate-200 px-3 py-2">
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input name="next_follow_up_date" type="date" className="rounded-md border border-slate-200 px-3 py-2" />
          <div className="sm:col-span-2">
            <button className="rounded-md bg-slate-900 px-4 py-2 text-white">Create</button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4 text-sm text-slate-600">{leads?.length || 0} prospects</div>
        <div className="divide-y divide-slate-200">
          {(leads || []).map((l) => (
            <div key={l.id} className="p-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <div className="font-medium">
                    {l.first_name} {l.last_name}
                  </div>
                  <div className="text-sm text-slate-600">
                    {l.phone || '—'} · {l.email || '—'}
                  </div>
                </div>

                <form action={updateLead} className="flex flex-wrap items-center gap-2">
                  <input type="hidden" name="id" value={l.id} />
                  <select name="status" defaultValue={l.status} className="rounded-md border border-slate-200 px-3 py-2 text-sm">
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <input
                    name="next_follow_up_date"
                    type="date"
                    defaultValue={l.next_follow_up_date || ''}
                    className="rounded-md border border-slate-200 px-3 py-2 text-sm"
                  />
                  <button className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">Save</button>
                </form>
              </div>
            </div>
          ))}
          {(leads || []).length === 0 ? (
            <div className="p-6 text-sm text-slate-600">
              No prospects yet. Add one above or import a CSV to get started.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
