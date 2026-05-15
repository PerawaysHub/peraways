"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { CANDIDATE_STATUSES } from "@/convex/schema"
import { LayoutDashboard, UserCheck, Users, MessageSquare, TrendingUp, ArrowRight, Clock } from "lucide-react"
import Link from "next/link"

const STATUS_THEME: Record<string, { bar: string; text: string }> = {
  "Neue Bewerbung": { bar: "bg-violet-400", text: "text-violet-700" },
  Kontaktiert: { bar: "bg-blue-400", text: "text-blue-600" },
  Gespräch: { bar: "bg-amber-400", text: "text-amber-600" },
  Angebot: { bar: "bg-orange-400", text: "text-orange-600" },
  Visum: { bar: "bg-emerald-400", text: "text-emerald-600" },
  Gestartet: { bar: "bg-primary", text: "text-primary" },
}

export default function DashboardPage() {
  const stats = useQuery(api.dashboard.getStats)

  if (stats === undefined) {
    return (
      <div className="space-y-6 pb-8">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center bg-primary/5 ring-1 ring-primary/10">
            <LayoutDashboard className="size-4 text-primary" />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">Dashboard</h1>
            <p className="text-[11px] font-medium text-muted-foreground/70">Loading overview...</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-gray-200 bg-white p-5 animate-pulse">
              <div className="h-3 w-20 bg-gray-100 mb-3" />
              <div className="h-8 w-16 bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const maxStatusCount = Math.max(...Object.values(stats.candidatesByStatus), 1)
  const pipelinePercent = stats.totalCandidates > 0
    ? Math.round((stats.activePipeline / stats.totalCandidates) * 100)
    : 0

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center bg-primary/5 ring-1 ring-primary/10">
          <LayoutDashboard className="size-4 text-primary" />
        </span>
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">Dashboard</h1>
          <p className="text-[11px] font-medium text-muted-foreground/70">Overview of your recruitment pipeline</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <Users className="size-4 text-primary" />
            <span className="text-[11px] font-semibold text-muted-foreground/70 tracking-wide uppercase">Total Candidates</span>
          </div>
          <p className="font-heading text-3xl font-bold text-gray-900 tabular-nums tracking-tight">
            {stats.totalCandidates}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-emerald-600">{stats.placed} placed</span>
          </div>
        </div>

        <div className="border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="size-4 text-amber-500" />
            <span className="text-[11px] font-semibold text-muted-foreground/70 tracking-wide uppercase">Active Pipeline</span>
          </div>
          <p className="font-heading text-3xl font-bold text-gray-900 tabular-nums tracking-tight">
            {stats.activePipeline}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-amber-600">{pipelinePercent}% of total</span>
          </div>
        </div>

        <div className="border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <UserCheck className="size-4 text-emerald-500" />
            <span className="text-[11px] font-semibold text-muted-foreground/70 tracking-wide uppercase">Placed</span>
          </div>
          <p className="font-heading text-3xl font-bold text-gray-900 tabular-nums tracking-tight">
            {stats.placed}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-emerald-600">Gestartet</span>
          </div>
        </div>

        <div className="border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="size-4 text-primary" />
            <span className="text-[11px] font-semibold text-muted-foreground/70 tracking-wide uppercase">Total Contacts</span>
          </div>
          <p className="font-heading text-3xl font-bold text-gray-900 tabular-nums tracking-tight">
            {stats.totalContacts}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <Link href="/dashboard/contacts" className="text-[11px] font-medium text-primary hover:underline inline-flex items-center gap-1">
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Pipeline breakdown + Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pipeline breakdown */}
        <div className="border border-gray-200 bg-white p-5">
          <h2 className="font-heading text-sm font-bold text-gray-900 tracking-tight mb-4">Pipeline Breakdown</h2>
          <div className="space-y-3">
            {CANDIDATE_STATUSES.map((status) => {
              const count = stats.candidatesByStatus[status] ?? 0
              const pct = maxStatusCount > 0 ? (count / maxStatusCount) * 100 : 0
              const theme = STATUS_THEME[status] ?? { bar: "bg-gray-300", text: "text-gray-600" }
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className="w-28 text-xs font-medium text-gray-600 truncate shrink-0">{status}</span>
                  <div className="flex-1 h-5 bg-gray-100/80 relative">
                    <div
                      className={`h-full ${theme.bar} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className={`w-6 text-right text-xs font-bold tabular-nums shrink-0 ${theme.text}`}>
                    {count}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent candidates */}
        <div className="border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-sm font-bold text-gray-900 tracking-tight">Recent Candidates</h2>
            <Link href="/dashboard/candidates" className="text-[11px] font-medium text-primary hover:underline inline-flex items-center gap-1">
              View board <ArrowRight className="size-3" />
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
              <p className="text-xs font-medium text-gray-300">No candidates yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent contacts */}
      <div className="border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-sm font-bold text-gray-900 tracking-tight">Recent Contacts</h2>
          <Link href="/dashboard/contacts" className="text-[11px] font-medium text-primary hover:underline inline-flex items-center gap-1">
            View all <ArrowRight className="size-3" />
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
            <p className="text-xs font-medium text-gray-300">No contacts yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
