import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const LeadSchema = z.object({
  first_name: z.string().optional().default(''),
  last_name: z.string().optional().default(''),
  email: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  status: z.string().optional().default('New'),
  next_follow_up_date: z.string().optional().nullable(),
})

const PayloadSchema = z.object({
  leads: z.array(LeadSchema).min(1).max(1000),
})

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const parsed = PayloadSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 })

  const rows = parsed.data.leads.map((l) => ({
    owner_id: user.id,
    ...l,
    next_follow_up_date: l.next_follow_up_date || null,
  }))

  const { error } = await supabase.from('leads').insert(rows)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ ok: true, imported: rows.length })
}
