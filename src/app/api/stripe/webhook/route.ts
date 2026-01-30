import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createSupabaseAdminClient } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  const stripe = getStripe()
  const admin = createSupabaseAdminClient()

  const sig = (await headers()).get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!sig || !webhookSecret) return NextResponse.json({ error: 'Missing webhook signature/secret' }, { status: 400 })

  const rawBody = await req.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
  }

  const type = event.type

  async function upsertSubscriptionFromCustomer(customerId: string) {
    const { data: bc } = await admin.from('billing_customers').select('owner_id').eq('stripe_customer_id', customerId).maybeSingle()
    if (!bc?.owner_id) return

    const subs = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 1 })
    const sub = subs.data[0]
    if (!sub) {
      await admin.from('subscriptions').delete().eq('owner_id', bc.owner_id)
      return
    }

    const currentPeriodEnd = (sub as unknown as { current_period_end?: number }).current_period_end

    await admin.from('subscriptions').upsert({
      owner_id: bc.owner_id,
      stripe_subscription_id: sub.id,
      status: sub.status,
      price_id: sub.items.data[0]?.price?.id ?? null,
      current_period_end: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null,
      cancel_at_period_end: sub.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    })
  }

  if (
    type === 'checkout.session.completed' ||
    type === 'customer.subscription.created' ||
    type === 'customer.subscription.updated' ||
    type === 'customer.subscription.deleted'
  ) {
    const obj = event.data.object as { customer?: string | null }
    const customerId = obj.customer as string | undefined
    if (customerId) await upsertSubscriptionFromCustomer(customerId)
  }

  return NextResponse.json({ received: true })
}
