"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import { CalendarCheck2, Loader2, Plus, CheckCircle2, Circle, Stamp, Landmark, Building2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { TERMIN_ARTEN } from "@/convex/schema"
import type { Id } from "@/convex/_generated/dataModel"

const ART_ICONS: Record<string, React.ElementType> = {
  LEA: Stamp,
  "Bankeröffnung": Landmark,
  "Bürgeramt": Building2,
  Sonstiges: MoreHorizontal,
}

const DAY_MS = 24 * 60 * 60 * 1000

function getTodayLocalDateString() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

type TerminRow = {
  _id: Id<"termine">
  candidateId: Id<"candidates">
  candidateName: string
  datum: number
  uhrzeit: string
  art: string
  status: "Offen" | "Erledigt"
  notizen?: string
}

function TerminRowItem({
  termin,
  accentClass,
  onToggleStatus,
}: {
  termin: TerminRow
  accentClass: string
  onToggleStatus: () => void
}) {
  const ArtIcon = ART_ICONS[termin.art] ?? MoreHorizontal
  return (
    <div className={`flex items-center justify-between gap-3 py-3 border-l-2 pl-3 ${accentClass}`}>
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex size-8 items-center justify-center bg-primary/5 text-primary ring-1 ring-primary/10 shrink-0">
          <ArtIcon className="size-4" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/candidates/${termin.candidateId}#termine-section`}
              className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors truncate"
            >
              {termin.candidateName}
            </Link>
            <span className="text-[11px] font-medium text-muted-foreground/70 shrink-0">
              {new Date(termin.datum).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })} · {termin.uhrzeit} · {termin.art}
            </span>
          </div>
          {termin.notizen && (
            <p className="text-xs text-muted-foreground/70 truncate">{termin.notizen}</p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onToggleStatus}
        className={`flex items-center gap-1.5 border px-2 py-1 text-[11px] font-semibold transition-all shrink-0 ${
          termin.status === "Erledigt"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-gray-50 text-gray-500 border-gray-200"
        }`}
      >
        {termin.status === "Erledigt" ? (
          <CheckCircle2 className="size-3.5" />
        ) : (
          <Circle className="size-3.5" />
        )}
        {termin.status}
      </button>
    </div>
  )
}

export default function HeutePage() {
  const todayStr = useMemo(() => getTodayLocalDateString(), [])
  const startOfDay = useMemo(() => new Date(todayStr).getTime(), [todayStr])
  const endOfDay = startOfDay + 24 * 60 * 60 * 1000

  const termine = useQuery(api.termine.listToday, { startOfDay, endOfDay })
  const ueberfaellig = useQuery(api.termine.listOpenBefore, { before: startOfDay })
  const baldFaelligRaw = useQuery(api.termine.listOpenBefore, { before: endOfDay + 3 * DAY_MS })
  const baldFaellig = baldFaelligRaw?.filter((t) => t.datum >= endOfDay)
  const candidates = useQuery(api.candidates.list)
  const createTermin = useMutation(api.termine.create)
  const updateStatus = useMutation(api.termine.updateStatus)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [candidateId, setCandidateId] = useState("")
  const [datum, setDatum] = useState(todayStr)
  const [uhrzeit, setUhrzeit] = useState("")
  const [art, setArt] = useState<(typeof TERMIN_ARTEN)[number]>("LEA")
  const [notizen, setNotizen] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleOpenDialog = () => {
    setCandidateId("")
    setDatum(todayStr)
    setUhrzeit("")
    setArt("LEA")
    setNotizen("")
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!candidateId || !uhrzeit) return
    setSubmitting(true)
    try {
      await createTermin({
        candidateId: candidateId as Id<"candidates">,
        datum: new Date(datum).getTime(),
        uhrzeit,
        art,
        notizen: notizen || undefined,
      })
      setDialogOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  const todayLabel = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center bg-primary/5 ring-1 ring-primary/10">
            <CalendarCheck2 className="size-4 text-primary" />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">Heute zu tun</h1>
            <p className="text-[11px] font-medium text-muted-foreground/70">{todayLabel}</p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={handleOpenDialog}
          className="text-xs gap-1.5 h-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
        >
          <Plus className="size-3.5" />
          Neuer Termin
        </Button>
      </div>

      {ueberfaellig !== undefined && ueberfaellig.length > 0 && (
        <div className="border border-red-200 bg-white p-5 rounded-2xl">
          <h2 className="text-xs font-bold text-red-700 uppercase tracking-wide mb-2">Überfällig</h2>
          <div className="divide-y divide-gray-100">
            {ueberfaellig.map((termin) => (
              <TerminRowItem
                key={termin._id}
                termin={termin}
                accentClass="border-red-400"
                onToggleStatus={() =>
                  updateStatus({
                    id: termin._id,
                    status: termin.status === "Offen" ? "Erledigt" : "Offen",
                  })
                }
              />
            ))}
          </div>
        </div>
      )}

      <div className="border border-gray-200 bg-white p-5 rounded-2xl">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Heute</h2>
        {termine === undefined ? (
          <div className="h-8 flex items-center">
            <Loader2 className="size-3.5 animate-spin text-gray-400" />
          </div>
        ) : termine.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {termine.map((termin) => (
              <TerminRowItem
                key={termin._id}
                termin={termin}
                accentClass="border-transparent"
                onToggleStatus={() =>
                  updateStatus({
                    id: termin._id,
                    status: termin.status === "Offen" ? "Erledigt" : "Offen",
                  })
                }
              />
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 py-2">Keine Termine für heute.</p>
        )}
      </div>

      {baldFaellig !== undefined && baldFaellig.length > 0 && (
        <div className="border border-amber-200 bg-white p-5 rounded-2xl">
          <h2 className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2">Bald fällig — nächste 3 Tage</h2>
          <div className="divide-y divide-gray-100">
            {baldFaellig.map((termin) => (
              <TerminRowItem
                key={termin._id}
                termin={termin}
                accentClass="border-amber-400"
                onToggleStatus={() =>
                  updateStatus({
                    id: termin._id,
                    status: termin.status === "Offen" ? "Erledigt" : "Offen",
                  })
                }
              />
            ))}
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neuer Termin</DialogTitle>
            <DialogDescription>Termin für ein Talent anlegen.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <select
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
              required
              className="h-9 border border-gray-200 bg-gray-50/50 px-2 text-sm text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
            >
              <option value="">Talent auswählen *</option>
              {candidates?.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={datum}
                onChange={(e) => setDatum(e.target.value)}
                required
                className="h-9 border border-gray-200 bg-gray-50/50 px-2 text-sm text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
              />
              <input
                type="time"
                value={uhrzeit}
                onChange={(e) => setUhrzeit(e.target.value)}
                required
                className="h-9 border border-gray-200 bg-gray-50/50 px-2 text-sm text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
              />
            </div>
            <select
              value={art}
              onChange={(e) => setArt(e.target.value as (typeof TERMIN_ARTEN)[number])}
              className="h-9 border border-gray-200 bg-gray-50/50 px-2 text-sm text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
            >
              {TERMIN_ARTEN.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <Textarea
              placeholder="Notizen (optional)"
              value={notizen}
              onChange={(e) => setNotizen(e.target.value)}
              rows={3}
            />

            <DialogFooter>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="size-4 animate-spin" />}
                Termin anlegen
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
