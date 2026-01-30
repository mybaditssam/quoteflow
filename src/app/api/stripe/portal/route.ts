import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { getStripe } from '@/lib/stripe'

export async function POST() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createSupabaseAdminClient()
  const stripe = getStripe()

  const { data: bc } = await admin.from('billing_customers').select('*').eq('owner_id', user.id).maybeSingle()
  if (!bc?.stripe_customer_id) return NextResponse.json({ error: 'No Stripe customer found. Subscribe first.' }, { status: 400 })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const session = await stripe.billingPortal.sessions.create({
    customer: bc.stripe_customer_id,
    return_url: `${appUrl}/app/billing`,
  })

  return NextResponse.json({ url: session.url })
}
