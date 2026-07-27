"use client"

import { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { CANDIDATE_STATUSES } from "@/convex/schema"
import { LayoutDashboard, UserCheck, Users, MessageSquare, TrendingUp, ArrowRight, Clock, Euro, AlertCircle } from "lucide-react"
import Link from "next/link"

const STATUS_THEME: Record<string, { bar: string; text: string }> = {
  Qualifizierung: { bar: "bg-violet-400", text: "text-violet-700" },
  "LEA-Fast-Lane": { bar: "bg-blue-400", text: "text-blue-600" },
  Visum: { bar: "bg-amber-400", text: "text-amber-600" },
  "Onboarding / Berlin-Phase": { bar: "bg-orange-400", text: "text-orange-600" },
  Abgeschlossen: { bar: "bg-primary", text: "text-primary" },
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount)
}

export default function DashboardPage() {
  const stats = useQuery(api.dashboard.getStats)
  const currentUser = useQuery(api.users.getCurrentUser)
  const finanzStats = useQuery(api.finanzen.getFinanzStats)
  const [expandedStatus, setExpandedStatus] = useState<string | null>(null)
  const expandedCandidates = useQuery(
    api.candidates.getByStatus,
    expandedStatus ? { status: expandedStatus } : "skip"
  )

  if (stats === undefined) {
    return (
      <div className="space-y-6 pb-8">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/5 ring-1 ring-primary/10">
            <LayoutDashboard className="size-4 text-primary" />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">Dashboard</h1>
            <p className="text-[11px] font-medium text-muted-foreground/70">Übersicht wird geladen...</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-gray-200 bg-white p-5 rounded-2xl animate-pulse">
              <div className="h-3 w-20 bg-gray-100 mb-3" />
              <div className="h-8 w-16 bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const maxStatusCount = Math.max(...stats.statusCounts.map((s) => s.count), 1)
  const pipelinePercent = stats.totalCandidates > 0
    ? Math.round((stats.activePipeline / stats.totalCandidates) * 100)
    : 0

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/5 ring-1 ring-primary/10">
          <LayoutDashboard className="size-4 text-primary" />
        </span>
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">Dashboard</h1>
          <p className="text-[11px] font-medium text-muted-foreground/70">Überblick über deine Recruiting-Pipeline</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-gray-200 bg-white p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Users className="size-4 text-primary" />
            <span className="text-[11px] font-semibold text-muted-foreground/70 tracking-wide uppercase">Talente gesamt</span>
          </div>
          <p className="font-heading text-3xl font-bold text-gray-900 tabular-nums tracking-tight">
            {stats.totalCandidates}
          </p>
          <div className="mt-2 flex items-center justify-between gap-1.5">
            <span className="text-[11px] font-medium text-emerald-600">
              {stats.placed} von {stats.totalCandidates} vermittelt
            </span>
            <Link href="/dashboard/candidates" className="text-[11px] font-medium text-primary hover:underline inline-flex items-center gap-1 shrink-0">
              Alle ansehen <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>

        <div className="border border-gray-200 bg-white p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="size-4 text-amber-500" />
            <span className="text-[11px] font-semibold text-muted-foreground/70 tracking-wide uppercase">Aktive Pipeline</span>
          </div>
          <p className="font-heading text-3xl font-bold text-gray-900 tabular-nums tracking-tight">
            {stats.activePipeline}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-amber-600">{pipelinePercent}% der Gesamtzahl</span>
          </div>
        </div>

        <div className="border border-gray-200 bg-white p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <UserCheck className="size-4 text-emerald-500" />
            <span className="text-[11px] font-semibold text-muted-foreground/70 tracking-wide uppercase">Vermittelt</span>
          </div>
          <p className="font-heading text-3xl font-bold text-gray-900 tabular-nums tracking-tight">
            {stats.placed}
          </p>
          <div className="mt-2 flex items-center justify-between gap-1.5">
            <span className="text-[11px] font-medium text-emerald-600">
              {stats.placedInClosedEinrichtung} von {stats.placed} Abgeschlossen
            </span>
            <Link href="/dashboard/contacts" className="text-[11px] font-medium text-primary hover:underline inline-flex items-center gap-1 shrink-0">
              Alle ansehen <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>

        <div className="border border-gray-200 bg-white p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="size-4 text-primary" />
            <span className="text-[11px] font-semibold text-muted-foreground/70 tracking-wide uppercase">Einrichtungs-Anfragen gesamt</span>
          </div>
          <p className="font-heading text-3xl font-bold text-gray-900 tabular-nums tracking-tight">
            {stats.totalContacts}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <Link href="/dashboard/contacts" className="text-[11px] font-medium text-primary hover:underline inline-flex items-center gap-1">
              Alle ansehen <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      {stats.fristenWarnungCount > 0 && (
        <div className="border border-amber-200 bg-amber-50/50 p-5">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="size-4 text-amber-600" />
            <span className="text-[11px] font-semibold text-amber-700 tracking-wide uppercase">Fristen-Warnungen</span>
          </div>
          <p className="font-heading text-2xl font-bold text-amber-700 tabular-nums tracking-tight">
            {stats.fristenWarnungCount}
          </p>
          <p className="text-[11px] font-medium text-amber-600/80 mt-1">
            Talente mit Visum- oder Probezeit-Frist in ≤30 Tagen oder bereits abgelaufen
          </p>
        </div>
      )}

      {currentUser?.role === "admin" && finanzStats && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="border border-gray-200 bg-white p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Euro className="size-4 text-emerald-500" />
              <span className="text-[11px] font-semibold text-muted-foreground/70 tracking-wide uppercase">Bezahlter Umsatz</span>
            </div>
            <p className="font-heading text-3xl font-bold text-gray-900 tabular-nums tracking-tight">
              {formatCurrency(finanzStats.bezahlterUmsatz)}
            </p>
          </div>

          <div className="border border-gray-200 bg-white p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="size-4 text-amber-500" />
              <span className="text-[11px] font-semibold text-muted-foreground/70 tracking-wide uppercase">Offene Honorarforderungen</span>
            </div>
            <p className="font-heading text-3xl font-bold text-gray-900 tabular-nums tracking-tight">
              {formatCurrency(finanzStats.offeneHonorarforderungen)}
            </p>
            {finanzStats.faelligCount > 0 && (
              <div className="mt-2 flex items-center gap-1.5">
                <AlertCircle className="size-3 text-amber-500" />
                <span className="text-[11px] font-medium text-amber-600">{finanzStats.faelligCount} fällig</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pipeline breakdown + Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pipeline breakdown */}
        <div className="border border-gray-200 bg-white p-5 rounded-2xl">
          <h2 className="font-heading text-sm font-bold text-gray-900 tracking-tight mb-4">Pipeline-Übersicht</h2>
          <div className="space-y-3">
            {stats.statusCounts.map(({ status, count }) => {
              const pct = maxStatusCount > 0 ? (count / maxStatusCount) * 100 : 0
              const theme = STATUS_THEME[status] ?? { bar: "bg-gray-300", text: "text-gray-600" }
              const isExpanded = expandedStatus === status
              return (
                <div key={status}>
                  <div
                    className="flex items-center gap-3 cursor-pointer select-none"
                    onDoubleClick={() => setExpandedStatus(isExpanded ? null : status)}
                  >
                    <span className="w-28 text-xs font-medium text-gray-600 truncate shrink-0">{status}</span>
                    <div className="flex-1 h-6 rounded-full bg-gray-100/80 relative overflow-hidden">
                      <div
                        className={`h-full rounded-full ${theme.bar} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className={`w-6 text-right text-xs font-bold tabular-nums shrink-0 ${theme.text}`}>
                      {count}
                    </span>
                  </div>
                  {isExpanded && (
                    <div className="mt-2 mb-1 ml-1 space-y-1 border-l-2 border-gray-100 pl-3">
                      {expandedCandidates === undefined ? (
                        <p className="text-[11px] text-gray-400 py-1">Lädt...</p>
                      ) : expandedCandidates.length > 0 ? (
                        expandedCandidates.map((c) => (
                          <Link
                            key={c._id}
                            href={`/dashboard/candidates/${c._id}`}
                            className="block text-xs font-medium text-gray-700 hover:text-primary transition-colors py-0.5"
                          >
                            {c.name}
                          </Link>
                        ))
                      ) : (
                        <p className="text-[11px] text-gray-400 py-1">Keine Talente in dieser Phase.</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent candidates */}
        <div className="border border-gray-200 bg-white p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-sm font-bold text-gray-900 tracking-tight">Neueste Talente</h2>
            <Link href="/dashboard/candidates" className="text-[11px] font-medium text-primary hover:underline inline-flex items-center gap-1">
              Zum Board <ArrowRight className="size-3" />
            </Link>
          </div>
          {stats.recentCandidates.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {stats.recentCandidates.map((c) => {
                const theme = STATUS_THEME[c.status] ?? { bar: "bg-gray-300", text: "text-gray-600" }
                return (
                  <Link
                    key={c._id}
                    href={`/dashboard/candidates/${c._id}`}
                    className="flex items-center justify-between py-2.5 group hover:bg-gray-50/50 -mx-5 px-5 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
                        {c.name}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">{c.email}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-semibold ${theme.text}`}>{c.status}</span>
                      <Clock className="size-3 text-gray-300" />
                      <span className="text-[10px] text-gray-400 tabular-nums">
                        {new Date(c._creationTime).toLocaleDateString("de-DE")}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="size-8 text-gray-200 mb-2" />
              <p className="text-xs font-medium text-gray-300">Noch keine Talente</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent contacts */}
      <div className="border border-gray-200 bg-white p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-sm font-bold text-gray-900 tracking-tight">Neueste Einrichtungs-Anfragen</h2>
          <Link href="/dashboard/contacts" className="text-[11px] font-medium text-primary hover:underline inline-flex items-center gap-1">
            Alle ansehen <ArrowRight className="size-3" />
          </Link>
        </div>
        {stats.recentContacts.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {stats.recentContacts.map((c) => (
              <Link
                key={c._id}
                href={`/dashboard/contacts/${c._id}`}
                className="flex items-center justify-between py-2.5 group hover:bg-gray-50/50 -mx-5 px-5 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
                    {c.name}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">{c.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-medium text-gray-400">{c.lang?.toUpperCase()}</span>
                  <Clock className="size-3 text-gray-300" />
                  <span className="text-[10px] text-gray-400 tabular-nums">
                    {new Date(c._creationTime).toLocaleDateString("de-DE")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="size-8 text-gray-200 mb-2" />
            <p className="text-xs font-medium text-gray-300">Noch keine Anfragen</p>
          </div>
        )}
      </div>
    </div>
  )
}
