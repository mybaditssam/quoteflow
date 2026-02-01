import Link from 'next/link'

const FEATURES = [
  {
    title: 'Daily follow-up list',
    desc: 'Know exactly who to call, text, or email today—based on the next follow-up date you set.',
  },
  {
    title: 'Simple pipeline tracking',
    desc: 'Track prospect status from New → Contacted → Quoted → Won/Lost so nothing slips through.',
  },
  {
    title: 'Scripts that stay consistent',
    desc: 'Save your best SMS/email scripts so your follow-up is fast, professional, and repeatable.',
  },
  {
    title: 'CSV import in minutes',
    desc: 'Bring in your existing prospect list from a spreadsheet with a clean CSV import flow.',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="bg-gradient-to-b from-slate-50 via-white to-white">
        <header className="sticky top-0 z-10 border-b border-slate-200/60 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-sm font-semibold text-white">
                QF
              </span>
              QuoteFlow
            </Link>

            <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
              <a className="hover:text-slate-900" href="#features">
                Features
              </a>
              <a className="hover:text-slate-900" href="#pricing">
                Pricing
              </a>
              <a className="hover:text-slate-900" href="#security">
                No-PHI
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <Link className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100" href="/login">
                Log in
              </Link>
              <Link
                className="rounded-md bg-teal-600 px-3 py-2 text-sm text-white hover:bg-teal-700"
                href="/login?mode=signup"
              >
                Get started
              </Link>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-6 pb-16 pt-14">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                Built for independent insurance agents
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                No PHI
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Follow-up that feels effortless.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
                QuoteFlow helps you stay on top of prospect follow-ups with a clean pipeline, a daily follow-up list, and reusable
                scripts—without the overhead of a full CRM.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link className="rounded-md bg-teal-600 px-5 py-3 text-sm font-medium text-white hover:bg-teal-700" href="/login?mode=signup">
                  Create your account
                </Link>
                <Link className="rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-medium hover:bg-slate-50" href="/login">
                  Log in
                </Link>
              </div>

              <div className="mt-6 text-sm text-slate-500">
                $29/month · Cancel anytime · Built to keep you organized and consistent
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-medium text-slate-900">What you’ll do in QuoteFlow</div>
              <div className="mt-4 grid gap-3">
                {[
                  { label: 'Add prospects', note: 'Manually or via CSV import' },
                  { label: 'Update status', note: 'New, Contacted, Quoted, Won, Lost' },
                  { label: 'Set next follow-up', note: 'Keep your day focused' },
                  { label: 'Reuse scripts', note: 'Standardize your messaging' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
                    <div>
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs text-slate-600">{item.note}</div>
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">↳</div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600">
                Tip: QuoteFlow is intentionally lightweight. Store contact info + activity dates—no sensitive health information.
              </div>
            </div>
          </div>
        </section>
      </div>

      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Built around agent workflows</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              A focused set of tools to keep your follow-up consistent, your pipeline visible, and your day prioritized.
            </p>
          </div>

          <div className="lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {FEATURES.map((c) => (
                <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="text-base font-semibold">{c.title}</div>
                  <div className="mt-2 text-sm leading-relaxed text-slate-600">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Social proof</h2>
              <p className="mt-2 text-sm text-slate-600">
                Add your customer logos and testimonials here as you collect them.
              </p>
            </div>

            <div className="grid w-full gap-3 sm:grid-cols-3 lg:max-w-3xl">
              {['Agency logo', 'Agency logo', 'Agency logo'].map((label, idx) => (
                <div key={`${label}-${idx}`} className="flex h-16 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm text-slate-500">
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {[
              { quote: '“QuoteFlow keeps my follow-ups organized without feeling like a full CRM.”', name: 'Independent agent', role: 'Medicare / Health' },
              { quote: '“My day starts with the follow-up list—then I just work it.”', name: 'Agency owner', role: 'P&C / Life' },
              { quote: '“Scripts help my team stay consistent and professional.”', name: 'Producer', role: 'Commercial lines' },
            ].map((t) => (
              <div key={t.quote} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm leading-relaxed text-slate-700">{t.quote}</div>
                <div className="mt-4 text-xs text-slate-500">
                  {t.name} · {t.role} (placeholder)
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Simple pricing</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              One plan that covers the core workflow: track prospects, manage follow-ups, and keep your scripts in one place.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-baseline justify-between">
              <div className="text-base font-semibold">QuoteFlow</div>
              <div className="text-right">
                <div className="text-3xl font-semibold">$29</div>
                <div className="text-xs text-slate-500">per month</div>
              </div>
            </div>

            <ul className="mt-5 space-y-2 text-sm text-slate-700">
              {[
                'Prospect list + pipeline status',
                'Daily follow-up list',
                'CSV import',
                'SMS/email scripts library',
                'Stripe billing and self-serve portal',
              ].map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="mt-0.5 text-slate-400">•</span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="rounded-md bg-teal-600 px-5 py-3 text-sm font-medium text-white hover:bg-teal-700" href="/login?mode=signup">
                Start now
              </Link>
              <Link className="rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-medium hover:bg-slate-50" href="/login">
                Log in
              </Link>
            </div>

            <div className="mt-4 text-xs text-slate-500">No PHI. Store contact info only. Cancel anytime.</div>
          </div>
        </div>
      </section>

      <section id="security" className="bg-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-3">
            <div>
              <h2 className="text-xl font-semibold text-white">Designed to be no-PHI</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                QuoteFlow is built for organizing outreach—not storing sensitive health information.
              </p>
            </div>
            <div className="lg:col-span-2">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: 'What you can store',
                    desc: 'Basic contact info, follow-up dates, and general status (e.g., “Quoted”).',
                  },
                  {
                    title: 'What you should not store',
                    desc: 'Any health details, diagnosis, plan details, or anything that could be considered PHI.',
                  },
                ].map((c) => (
                  <div key={c.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <div className="text-sm font-semibold text-white">{c.title}</div>
                    <div className="mt-2 text-sm leading-relaxed text-slate-200">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
            <div className="text-sm text-slate-300">© {new Date().getFullYear()} QuoteFlow</div>
            <div className="flex gap-3">
              <Link className="rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100" href="/login?mode=signup">
                Get started
              </Link>
              <Link className="rounded-md border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/10" href="/login">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
