# QuoteFlow (MVP)

QuoteFlow is a lightweight lead pipeline + follow-up queue for independent insurance agents.

## Stack
- Next.js (App Router) + Tailwind
- Supabase (Auth + Postgres + RLS)
- Stripe (subscriptions)

## Core Features (v1)
- CSV lead import
- Lead pipeline status + next follow-up date
- Daily follow-up queue
- Template library for SMS/email copy (no sending in v1)
- Onboarding
- Billing page (Stripe Checkout + Customer Portal)

---

## 1) Local dev
```bash
cp .env.example .env.local
npm install
npm run dev
```

## 2) Supabase setup
1. Create a Supabase project.
2. In Supabase SQL Editor, run the migrations in `supabase/migrations` in order.
3. Create an account in your app (email/password).
4. (Optional) Seed templates/leads:
   - Set `ADMIN_USER_ID` in your shell and run:
     ```bash
     ADMIN_USER_ID=... npm run seed:admin
     ```

### Required env vars
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)

## 3) Stripe setup
1. Create a **Product** called `QuoteFlow`.
2. Create a **recurring Price** (e.g. $29/mo) and copy its Price ID (`price_...`).
3. Set env vars:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_STRIPE_PRICE_ID=price_...`
   - `NEXT_PUBLIC_APP_URL` (prod: your Vercel URL)
4. Create a Stripe webhook endpoint pointing to:
   - `https://YOUR_APP_URL/api/stripe/webhook`
   Subscribe to events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

## 4) Vercel deploy
- Import the repo into Vercel
- Set env vars from `.env.example`
- Deploy

---

## CSV format
Minimal header set supported:
- `first_name`
- `last_name`
- `email`
- `phone`
- `status` (optional, defaults to `New`)
- `next_follow_up_date` (YYYY-MM-DD, optional)

