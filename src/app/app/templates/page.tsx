import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'

async function createTemplate(formData: FormData) {
  'use server'
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const channel = String(formData.get('channel') || 'sms')
  const title = String(formData.get('title') || '')
  const body = String(formData.get('body') || '')

  await supabase.from('templates').insert({ owner_id: user!.id, channel, title, body })
  revalidatePath('/app/templates')
}

export default async function TemplatesPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: templates } = await supabase
    .from('templates')
    .select('*')
    .eq('owner_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Templates</h1>
        <p className="mt-1 text-sm text-slate-600">Store your best SMS/email copy. No sending in v1.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="font-medium">New template</div>
        <form action={createTemplate} className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <select name="channel" className="rounded-md border border-slate-200 px-3 py-2">
              <option value="sms">SMS</option>
              <option value="email">Email</option>
            </select>
            <input name="title" className="sm:col-span-2 rounded-md border border-slate-200 px-3 py-2" placeholder="Title" required />
          </div>
          <textarea name="body" className="min-h-[140px] w-full rounded-md border border-slate-200 px-3 py-2" placeholder="Write your message…" required />
          <button className="rounded-md bg-slate-900 px-4 py-2 text-white">Save</button>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4 text-sm text-slate-600">{templates?.length || 0} templates</div>
        <div className="divide-y divide-slate-200">
          {(templates || []).map((t) => (
            <div key={t.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium">{t.title}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">{t.channel}</div>
                </div>
              </div>
              <pre className="mt-3 whitespace-pre-wrap rounded-md bg-slate-50 p-3 text-sm text-slate-800">{t.body}</pre>
            </div>
          ))}
          {(templates || []).length === 0 ? <div className="p-6 text-sm text-slate-600">No templates yet.</div> : null}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        Tip: Use variables like <code>{'{{first_name}}'}</code> and <code>{'{{agent_name}}'}</code>.
      </div>
    </div>
  )
}
