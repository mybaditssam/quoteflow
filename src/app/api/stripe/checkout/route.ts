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

  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID
  if (!priceId) return NextResponse.json({ error: 'Missing NEXT_PUBLIC_STRIPE_PRICE_ID' }, { status: 500 })

  const stripe = getStripe()
  const admin = createSupabaseAdminClient()

  const { data: existing } = await admin.from('billing_customers').select('*').eq('owner_id', user.id).maybeSingle()

  let customerId = existing?.stripe_customer_id as string | null | undefined

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email || undefined,
      metadata: { owner_id: user.id },
    })

    customerId = customer.id
    await admin.from('billing_customers').upsert({ owner_id: user.id, stripe_customer_id: customerId })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/app/billing?success=1`,
    cancel_url: `${appUrl}/app/billing?canceled=1`,
    allow_promotion_codes: true,
    subscription_data: {
      metadata: { owner_id: user.id },
    },
  })

  return NextResponse.json({ url: session.url })
}
