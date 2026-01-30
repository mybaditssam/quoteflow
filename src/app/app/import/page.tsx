'use client'

import Papa from 'papaparse'
import { useMemo, useState } from 'react'

type ParsedLead = {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  status?: string
  next_follow_up_date?: string
}

function normalizeKey(k: string) {
  return k.trim().toLowerCase().replaceAll(' ', '_')
}

export default function ImportPage() {
  const [rows, setRows] = useState<ParsedLead[]>([])
  const [error, setError] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [imported, setImported] = useState<number | null>(null)

  const preview = useMemo(() => rows.slice(0, 10), [rows])

  async function onFile(file: File) {
    setError(null)
    setImported(null)

    const text = await file.text()

    const result = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => normalizeKey(h),
    })

    if (result.errors?.length) {
      setError(result.errors[0].message)
      return
    }

    const data = (result.data || []).map((r) => ({
      first_name: r.first_name || r.firstname || r.first || '',
      last_name: r.last_name || r.lastname || r.last || '',
      email: r.email || '',
      phone: r.phone || r.mobile || '',
      status: r.status || 'New',
      next_follow_up_date: (r.next_follow_up_date || r.follow_up_date || '').trim() || undefined,
    }))

    setRows(data.filter((x) => x.email || x.phone || x.first_name || x.last_name))
  }

  async function doImport() {
    setError(null)
    setImporting(true)

    try {
      const res = await fetch('/api/leads/import', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ leads: rows }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Import failed')
      setImported(json.imported)
      setRows([])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Import prospects</h1>
        <p className="mt-1 text-sm text-slate-600">
          Upload a CSV to bring in your prospect list. Supported headers: first_name, last_name, email, phone, status, next_follow_up_date (YYYY-MM-DD).
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) void onFile(f)
          }}
        />

        {error ? <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}
        {imported != null ? (
          <div className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Imported {imported} prospects.</div>
        ) : null}

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-600">Ready: {rows.length}</div>
          <button
            disabled={rows.length === 0 || importing}
            onClick={() => void doImport()}
            className="rounded-md bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
          >
            {importing ? 'Importing…' : 'Import'}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-4 text-sm text-slate-600">Preview (first 10)</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Status</th>
                <th className="p-3">Next follow-up</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((r, idx) => (
                <tr key={idx} className="border-t border-slate-200">
                  <td className="p-3">{r.first_name} {r.last_name}</td>
                  <td className="p-3">{r.email || '—'}</td>
                  <td className="p-3">{r.phone || '—'}</td>
                  <td className="p-3">{r.status || 'New'}</td>
                  <td className="p-3">{r.next_follow_up_date || '—'}</td>
                </tr>
              ))}
              {preview.length === 0 ? (
                <tr>
                  <td className="p-6 text-slate-600" colSpan={5}>
                    No file loaded yet. Choose a CSV above to preview your first 10 rows.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
