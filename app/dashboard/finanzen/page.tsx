"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Euro, Loader2, Download, Search, TrendingUp, AlertCircle, Building2 } from "lucide-react"
import { FINANZEN_STATUSES } from "@/convex/schema"
import type { Id } from "@/convex/_generated/dataModel"

const FINANZEN_STATUS_COLORS: Record<string, string> = {
  Offen: "bg-gray-50 text-gray-500 border-gray-200",
  "Fällig": "bg-amber-50 text-amber-700 border-amber-200",
  Bezahlt: "bg-emerald-50 text-emerald-700 border-emerald-200",
}

const FILTERS = ["alle", ...FINANZEN_STATUSES] as const
type FilterKey = (typeof FILTERS)[number]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount)
}

function formatDate(ts?: number) {
  if (!ts) return "—"
  return new Date(ts).toLocaleDateString("de-DE")
}

function toDateInputValue(ts?: number) {
  if (!ts) return ""
  return new Date(ts).toISOString().slice(0, 10)
}

function fromDateInputValue(value: string): number | undefined {
  if (!value) return undefined
  return new Date(value).getTime()
}

type FinanzenListRow = {
  _id: Id<"finanzen">
  candidateId: Id<"candidates">
  candidateName: string
  einrichtungId: Id<"contacts"> | null
  einrichtungName: string | null
  honorarbetrag: "8500" | "8000"
  rabattAngewendet: boolean
  status: "Offen" | "Fällig" | "Bezahlt"
  faelligkeitsdatum?: number
  bezahldatum?: number
}

function FinanzenRow({
  row,
  onUpdateHonorar,
  onSetStatus,
}: {
  row: FinanzenListRow
  onUpdateHonorar: (candidateId: Id<"candidates">, honorarbetrag: "8500" | "8000", rabattAngewendet: boolean) => void
  onSetStatus: (candidateId: Id<"candidates">, status: (typeof FINANZEN_STATUSES)[number], bezahldatum?: number) => void
}) {
  const [bezahldatumDraft, setBezahldatumDraft] = useState("")

  const handleBezahldatumChange = useCallback(
    (value: string) => {
      setBezahldatumDraft(value)
      if (row.status === "Bezahlt") onSetStatus(row.candidateId, "Bezahlt", fromDateInputValue(value))
    },
    [row.candidateId, row.status, onSetStatus]
  )

  const handleStatusChange = useCallback(
    (status: (typeof FINANZEN_STATUSES)[number]) => {
      onSetStatus(
        row.candidateId,
        status,
        status === "Bezahlt" ? fromDateInputValue(bezahldatumDraft) ?? Date.now() : undefined
      )
    },
    [row.candidateId, bezahldatumDraft, onSetStatus]
  )

  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-3 pr-4 whitespace-nowrap">
        <Link
          href={`/dashboard/candidates/${row.candidateId}`}
          className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors"
        >
          {row.candidateName}
        </Link>
      </td>
      <td className="py-3 pr-4 whitespace-nowrap text-sm text-gray-500">
        {row.einrichtungId && row.einrichtungName ? (
          <Link href={`/dashboard/contacts/${row.einrichtungId}`} className="hover:text-primary transition-colors">
            {row.einrichtungName}
          </Link>
        ) : (
          <span className="text-gray-300">—</span>
        )}
      </td>
      <td className="py-3 pr-4">
        <select
          value={row.honorarbetrag}
          onChange={(e) => {
            const v = e.target.value as "8500" | "8000"
            onUpdateHonorar(row.candidateId, v, v === "8000")
          }}
          className="h-8 rounded-lg border border-gray-200 bg-gray-50/50 px-2 text-xs text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
        >
          <option value="8500">8.500 €</option>
          <option value="8000">8.000 € (Rabatt)</option>
        </select>
      </td>
      <td className="py-3 pr-4">
        <div className="flex flex-wrap gap-1">
          {FINANZEN_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStatusChange(s)}
              className={`border px-2 py-0.5 text-[11px] font-semibold transition-all ${
                row.status === s ? FINANZEN_STATUS_COLORS[s] : "bg-white text-gray-400 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </td>
      <td className="py-3 pr-4 whitespace-nowrap text-xs text-gray-500">{formatDate(row.faelligkeitsdatum)}</td>
      <td className="py-3 pr-4">
        <input
          type="date"
          value={bezahldatumDraft || toDateInputValue(row.bezahldatum)}
          onChange={(e) => handleBezahldatumChange(e.target.value)}
          className="h-8 rounded-lg border border-gray-200 bg-gray-50/50 px-2 text-xs text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
        />
      </td>
    </tr>
  )
}

export default function FinanzenPage() {
  const router = useRouter()
  const currentUser = useQuery(api.users.getCurrentUser)
  const canView = currentUser?.role === "admin"

  useEffect(() => {
    if (currentUser === null) return
    if (currentUser && !canView) router.replace("/dashboard")
  }, [currentUser, canView, router])

  const rows = useQuery(api.finanzen.listAll)
  const updateHonorar = useMutation(api.finanzen.updateHonorar)
  const setStatus = useMutation(api.finanzen.setStatus)

  const [filter, setFilter] = useState<FilterKey>("alle")
  const [search, setSearch] = useState("")

  const summary = useMemo(() => {
    let bezahlterUmsatz = 0
    let offeneHonorarforderungen = 0
    let faelligCount = 0
    for (const r of rows ?? []) {
      const betrag = Number(r.honorarbetrag)
      if (r.status === "Bezahlt") {
        bezahlterUmsatz += betrag
      } else {
        offeneHonorarforderungen += betrag
        if (r.status === "Fällig") faelligCount++
      }
    }
    return { bezahlterUmsatz, offeneHonorarforderungen, faelligCount }
  }, [rows])

  const monthlyRevenue = useMemo(() => {
    const buckets = new Map<string, number>()
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      buckets.set(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, 0)
    }
    for (const r of rows ?? []) {
      if (r.status !== "Bezahlt" || !r.bezahldatum) continue
      const d = new Date(r.bezahldatum)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + Number(r.honorarbetrag))
    }
    return Array.from(buckets.entries()).map(([key, total]) => {
      const [y, m] = key.split("-").map(Number)
      return {
        key,
        label: new Date(y, m - 1, 1).toLocaleDateString("de-DE", { month: "short", year: "2-digit" }),
        total,
      }
    })
  }, [rows])
  const maxMonthlyRevenue = Math.max(1, ...monthlyRevenue.map((m) => m.total))

  const einrichtungBreakdown = useMemo(() => {
    const groups = new Map<string, { bezahlt: number; offen: number }>()
    for (const r of rows ?? []) {
      const key = r.einrichtungName ?? "Keine Einrichtung"
      const entry = groups.get(key) ?? { bezahlt: 0, offen: 0 }
      const betrag = Number(r.honorarbetrag)
      if (r.status === "Bezahlt") entry.bezahlt += betrag
      else entry.offen += betrag
      groups.set(key, entry)
    }
    return Array.from(groups.entries())
      .map(([name, v]) => ({ name, ...v, total: v.bezahlt + v.offen }))
      .filter((g) => g.total > 0)
      .sort((a, b) => b.total - a.total)
  }, [rows])
  const maxEinrichtungTotal = Math.max(1, ...einrichtungBreakdown.map((g) => g.total))

  const filteredRows = useMemo(() => {
    return (rows ?? []).filter((r) => {
      if (filter !== "alle" && r.status !== filter) return false
      if (search && !r.candidateName.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [rows, filter, search])

  if (!canView) return null

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/5 ring-1 ring-primary/10">
            <Euro className="size-4 text-primary" />
          </span>
          <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">Finanzen</h1>
        </div>
        <a
          href="/api/export-finanzen"
          download
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Download className="size-3.5" />
          CSV exportieren
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border border-gray-200 bg-white p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Euro className="size-4 text-emerald-500" />
            <span className="text-[11px] font-semibold text-muted-foreground/70 tracking-wide uppercase">Bezahlter Umsatz</span>
          </div>
          <p className="font-heading text-3xl font-bold text-gray-900 tabular-nums tracking-tight">
            {formatCurrency(summary.bezahlterUmsatz)}
          </p>
        </div>

        <div className="border border-gray-200 bg-white p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="size-4 text-amber-500" />
            <span className="text-[11px] font-semibold text-muted-foreground/70 tracking-wide uppercase">Offene Honorarforderungen</span>
          </div>
          <p className="font-heading text-3xl font-bold text-gray-900 tabular-nums tracking-tight">
            {formatCurrency(summary.offeneHonorarforderungen)}
          </p>
          {summary.faelligCount > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              <AlertCircle className="size-3 text-amber-500" />
              <span className="text-[11px] font-medium text-amber-600">{summary.faelligCount} fällig</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border border-gray-200 bg-white p-5 rounded-2xl">
          <h2 className="font-heading text-sm font-bold text-gray-900 tracking-tight mb-4">Umsatz-Verlauf</h2>
          {rows === undefined ? (
            <div className="h-8 flex items-center">
              <Loader2 className="size-3.5 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-2.5">
              {monthlyRevenue.map((m) => (
                <div key={m.key} className="flex items-center gap-3">
                  <span className="w-14 text-xs font-medium text-gray-600 truncate shrink-0">{m.label}</span>
                  <div className="flex-1 h-5 rounded-full bg-gray-100/80 relative overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                      style={{ width: `${(m.total / maxMonthlyRevenue) * 100}%` }}
                    />
                  </div>
                  <span className="w-20 text-right text-[11px] font-bold tabular-nums text-gray-500 shrink-0">
                    {m.total > 0 ? formatCurrency(m.total) : "—"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border border-gray-200 bg-white p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="size-4 text-gray-400" />
            <h2 className="font-heading text-sm font-bold text-gray-900 tracking-tight">Auswertung pro Einrichtung</h2>
          </div>
          {rows === undefined ? (
            <div className="h-8 flex items-center">
              <Loader2 className="size-3.5 animate-spin text-gray-400" />
            </div>
          ) : einrichtungBreakdown.length > 0 ? (
            <div className="space-y-2.5">
              {einrichtungBreakdown.map((g) => (
                <div key={g.name} className="flex items-center gap-3">
                  <span className="w-28 text-xs font-medium text-gray-600 truncate shrink-0">{g.name}</span>
                  <div className="flex-1 h-5 rounded-full bg-gray-100/80 relative overflow-hidden flex">
                    <div className="h-full bg-emerald-400" style={{ width: `${(g.bezahlt / maxEinrichtungTotal) * 100}%` }} />
                    <div className="h-full bg-amber-400" style={{ width: `${(g.offen / maxEinrichtungTotal) * 100}%` }} />
                  </div>
                  <span className="w-20 text-right text-[11px] font-bold tabular-nums text-gray-500 shrink-0">
                    {formatCurrency(g.total)}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-3 pt-1 text-[10px] text-muted-foreground/60">
                <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-400" /> Bezahlt</span>
                <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full bg-amber-400" /> Offen</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400 py-2">Keine Daten.</p>
          )}
        </div>
      </div>

      <div className="border border-gray-200 bg-white p-5 rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`h-8 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                  filter === f
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {f === "alle" ? "Alle" : f}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-300" />
            <input
              type="text"
              placeholder="Talent suchen…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-48 rounded-lg border border-gray-200 bg-gray-50/50 pl-8 pr-2 text-xs text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
            />
          </div>
        </div>

        {rows === undefined ? (
          <div className="h-8 flex items-center">
            <Loader2 className="size-3.5 animate-spin text-gray-400" />
          </div>
        ) : filteredRows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-2 pr-4 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wide">Talent</th>
                  <th className="pb-2 pr-4 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wide">Einrichtung</th>
                  <th className="pb-2 pr-4 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wide">Honorar</th>
                  <th className="pb-2 pr-4 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wide">Status</th>
                  <th className="pb-2 pr-4 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wide">Fälligkeit</th>
                  <th className="pb-2 pr-4 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wide">Bezahldatum</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <FinanzenRow
                    key={row._id}
                    row={row}
                    onUpdateHonorar={(candidateId, honorarbetrag, rabattAngewendet) =>
                      updateHonorar({ candidateId, honorarbetrag, rabattAngewendet })
                    }
                    onSetStatus={(candidateId, status, bezahldatum) => setStatus({ candidateId, status, bezahldatum })}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-gray-400 py-2">Keine Talente gefunden.</p>
        )}
      </div>
    </div>
  )
}
