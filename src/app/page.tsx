import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <header className="flex items-center justify-between">
          <div className="text-xl font-semibold">QuoteFlow</div>
          <div className="flex gap-3">
            <Link className="rounded-md px-3 py-2 text-sm hover:bg-slate-100" href="/login">
              Log in
            </Link>
            <Link className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white" href="/login">
              Start free setup
            </Link>
          </div>
        </header>

        <section className="mt-14">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
            A simple lead pipeline + daily follow-up queue for independent agents.
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            Import leads from CSV, track status, set the next follow-up date, and work a daily queue.
            Keep your best SMS/email scripts in one place. No PHI.
          </p>

          <div className="mt-8 flex gap-3">
            <Link className="rounded-md bg-slate-900 px-4 py-2 text-white" href="/login">
              Create account
            </Link>
            <Link className="rounded-md border border-slate-200 px-4 py-2" href="/app">
              Go to app
            </Link>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { title: 'CSV import', desc: 'Bring your leads in fast with a clean import flow.' },
              { title: 'Pipeline status', desc: 'New → Contacted → Quoted → Won/Lost (customizable later).' },
              { title: 'Daily queue', desc: 'Today’s follow-ups, sorted and ready.' },
            ].map((c) => (
              <div key={c.title} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="font-medium">{c.title}</div>
                <div className="mt-1 text-sm text-slate-600">{c.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-16 text-sm text-slate-500">
          Built for independent agents. Store lead contact info only. Do not store PHI.
        </footer>
      </div>
    </main>
  )
}
