'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'

type Props = {
  userLabel: string
  subscribed: boolean
  children: React.ReactNode
}

const navItems = [
  { href: '/app', label: 'Today' },
  { href: '/app/leads', label: 'Prospects' },
  { href: '/app/import', label: 'Import' },
  { href: '/app/templates', label: 'Scripts' },
  { href: '/app/billing', label: 'Billing' },
]

function cx(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(' ')
}

export default function AppShell({ userLabel, subscribed, children }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const currentTitle = useMemo(() => {
    const hit = navItems.find((i) => i.href === pathname)
    return hit?.label ?? 'QuoteFlow'
  }, [pathname])

  const Nav = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="mt-4 space-y-1">
      {navItems.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => onNavigate?.()}
            className={cx(
              'flex items-center rounded-xl px-3 py-2 text-sm transition',
              active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            {item.label}
          </Link>
        )
      })}

      <div className="mt-4 border-t border-slate-200 pt-4">
        <Link
          href="/logout"
          onClick={() => onNavigate?.()}
          className="flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100"
        >
          Log out
        </Link>
      </div>
    </nav>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
            aria-label="Open menu"
          >
            Menu
          </button>
          <div className="text-sm font-semibold text-slate-900">{currentTitle}</div>
          <div className={cx('rounded-full px-2 py-1 text-xs', subscribed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>
            {subscribed ? 'Subscribed' : 'Not subscribed'}
          </div>
        </div>
      </header>

      {/* Desktop layout */}
      <div className="mx-auto flex max-w-6xl">
        <aside className="hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white p-4 md:block">
          <Link href="/app" className="flex items-center gap-2 px-2 py-2">
            <div className="h-8 w-8 rounded-xl bg-slate-900" />
            <div className="text-sm font-semibold">QuoteFlow</div>
          </Link>

          <Nav />

          <div className="mt-6 text-xs text-slate-500">{userLabel}</div>
          <div className={cx('mt-2 inline-flex rounded-full px-2 py-1 text-xs', subscribed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>
            {subscribed ? 'Subscribed' : 'Not subscribed'}
          </div>
        </aside>

        <main className="w-full px-4 py-6 md:px-6">{children}</main>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-30 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] border-r border-slate-200 bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <Link href="/app" onClick={() => setOpen(false)} className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-slate-900" />
                <div className="text-sm font-semibold">QuoteFlow</div>
              </Link>
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                Close
              </button>
            </div>

            <div className="mt-3 text-xs text-slate-500">{userLabel}</div>
            <div className={cx('mt-2 inline-flex rounded-full px-2 py-1 text-xs', subscribed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>
              {subscribed ? 'Subscribed' : 'Not subscribed'}
            </div>

            <Nav onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
