"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import { CalendarCheck2, Loader2, Plus, CheckCircle2, Circle, Stamp, Landmark, Building2, MoreHorizontal, PhoneCall, Handshake, Lock, Users } from "lucide-react"
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
import { CANDIDATE_TERMIN_ARTEN } from "@/convex/schema"
import type { Id } from "@/convex/_generated/dataModel"

const ART_ICONS: Record<string, React.ElementType> = {
  LEA: Stamp,
  "Bankeröffnung": Landmark,
  "Bürgeramt": Building2,
  "Rückruf": PhoneCall,
  Treffen: Handshake,
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
  candidateId?: Id<"candidates">
  contactId?: Id<"contacts">
  relatedName: string
  relatedHref: string
  datum: number
  uhrzeit: string
  art: string
  status: "Offen" | "Erledigt"
  notizen?: string
  visibility?: "alle" | "nur_ich"
}

const FILTERS = [
  { key: "alle", label: "Alle" },
  { key: "heute", label: "Heute" },
  { key: "ueberfaellig", label: "Überfällig" },
  { key: "bald", label: "Bald fällig" },
] as const

type FilterKey = (typeof FILTERS)[number]["key"]

function TerminRowItem({
  termin,
  accentClass,
  onToggleStatus,
  isAdmin,
  onToggleVisibility,
}: {
  termin: TerminRow
  accentClass: string
  onToggleStatus: () => void
  isAdmin: boolean
  onToggleVisibility: () => void
}) {
  const ArtIcon = ART_ICONS[termin.art] ?? MoreHorizontal
  const isPrivate = termin.visibility === "nur_ich"
  return (
    <div className={`flex items-center justify-between gap-3 py-3 border-l-2 pl-3 ${accentClass}`}>
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/5 text-primary ring-1 ring-primary/10 shrink-0">
          <ArtIcon className="size-4" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Link
              href={termin.relatedHref}
              className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors truncate"
            >
              {termin.relatedName}
            </Link>
            <span className="text-[11px] font-medium text-muted-foreground/70 shrink-0">
              {new Date(termin.datum).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })} · {termin.uhrzeit} · {termin.art}
            </span>
            {isPrivate && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 shrink-0">
                <Lock className="size-2.5" />
                Nur ich
              </span>
            )}
          </div>
          {termin.notizen && (
            <p className="text-xs text-muted-foreground/70 truncate">{termin.notizen}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {isAdmin && (
          <button
            type="button"
            onClick={onToggleVisibility}
            title={isPrivate ? "Für alle sichtbar machen" : "Nur für mich sichtbar machen"}
            className="flex items-center justify-center size-7 text-gray-300 hover:text-primary transition-colors"
          >
            {isPrivate ? <Lock className="size-3.5" /> : <Users className="size-3.5" />}
          </button>
        )}
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
    </div>
  )
}

export default function TerminePage() {
  const todayStr = useMemo(() => getTodayLocalDateString(), [])
  const startOfDay = useMemo(() => new Date(todayStr).getTime(), [todayStr])
  const endOfDay = startOfDay + DAY_MS

  const currentUser = useQuery(api.users.getCurrentUser)
  const isAdmin = currentUser?.role === "admin"

  const alle = useQuery(api.termine.listAll)
  const candidates = useQuery(api.candidates.list)
  const createTermin = useMutation(api.termine.create)
  const updateStatus = useMutation(api.termine.updateStatus)
  const updateTermin = useMutation(api.termine.update)

  const [filter, setFilter] = useState<FilterKey>("alle")

  const [dialogOpen, setDialogOpen] = useState(false)
  const [candidateId, setCandidateId] = useState("")
  const [datum, setDatum] = useState(todayStr)
  const [uhrzeit, setUhrzeit] = useState("")
  const [art, setArt] = useState<(typeof CANDIDATE_TERMIN_ARTEN)[number]>("LEA")
  const [notizen, setNotizen] = useState("")
  const [visibility, setVisibility] = useState<"alle" | "nur_ich">("alle")
  const [submitting, setSubmitting] = useState(false)

  const handleOpenDialog = () => {
    setCandidateId("")
    setDatum(todayStr)
    setUhrzeit("")
    setArt("LEA")
    setNotizen("")
    setVisibility("alle")
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
        visibility,
      })
      setDialogOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleVisibility = (termin: TerminRow) => {
    updateTermin({
      id: termin._id,
      visibility: termin.visibility === "nur_ich" ? "alle" : "nur_ich",
    })
  }

  const todayLabel = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  const ueberfaellig = alle?.filter((t) => t.status === "Offen" && t.datum < startOfDay)
  const heute = alle?.filter((t) => t.datum >= startOfDay && t.datum < endOfDay)
  const baldFaellig = alle?.filter(
    (t) => t.status === "Offen" && t.datum >= endOfDay && t.datum < endOfDay + 3 * DAY_MS
  )
  const weitere = alle?.filter(
    (t) =>
      !(t.datum >= startOfDay && t.datum < endOfDay) &&
      !(t.status === "Offen" && t.datum < startOfDay) &&
      !(t.status === "Offen" && t.datum >= endOfDay && t.datum < endOfDay + 3 * DAY_MS)
  )

  const renderRow = (termin: TerminRow, accentClass: string) => (
    <TerminRowItem
      key={termin._id}
      termin={termin}
      accentClass={accentClass}
      isAdmin={isAdmin}
      onToggleVisibility={() => toggleVisibility(termin)}
      onToggleStatus={() =>
        updateStatus({
          id: termin._id,
          status: termin.status === "Offen" ? "Erledigt" : "Offen",
        })
      }
    />
  )

  const renderSection = (title: string, rows: TerminRow[] | undefined, accentClass: string, headerClass: string) =>
    rows !== undefined && rows.length > 0 ? (
      <div className="border border-gray-200 bg-white p-5 rounded-2xl">
        <h2 className={`text-xs font-bold uppercase tracking-wide mb-2 ${headerClass}`}>{title}</h2>
        <div className="divide-y divide-gray-100">{rows.map((t) => renderRow(t, accentClass))}</div>
      </div>
    ) : null

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/5 ring-1 ring-primary/10">
            <CalendarCheck2 className="size-4 text-primary" />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">Termine</h1>
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

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`h-8 px-3 rounded-lg text-xs font-semibold border transition-colors ${
              filter === f.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {alle === undefined && (
        <div className="h-8 flex items-center">
          <Loader2 className="size-3.5 animate-spin text-gray-400" />
        </div>
      )}

      {alle !== undefined && filter === "alle" && (
        <>
          {renderSection("Überfällig", ueberfaellig, "border-red-400", "text-red-700")}
          <div className="border border-gray-200 bg-white p-5 rounded-2xl">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Heute</h2>
            {heute && heute.length > 0 ? (
              <div className="divide-y divide-gray-100">{heute.map((t) => renderRow(t, "border-transparent"))}</div>
            ) : (
              <p className="text-xs text-gray-400 py-2">Keine Termine für heute.</p>
            )}
          </div>
          {renderSection("Bald fällig — nächste 3 Tage", baldFaellig, "border-amber-400", "text-amber-700")}
          {renderSection("Weitere Termine", weitere, "border-transparent", "text-muted-foreground")}
        </>
      )}

      {alle !== undefined && filter === "heute" && (
        <div className="border border-gray-200 bg-white p-5 rounded-2xl">
          {heute && heute.length > 0 ? (
            <div className="divide-y divide-gray-100">{heute.map((t) => renderRow(t, "border-transparent"))}</div>
          ) : (
            <p className="text-xs text-gray-400 py-2">Keine Termine für heute.</p>
          )}
        </div>
      )}

      {alle !== undefined && filter === "ueberfaellig" && (
        <div className="border border-gray-200 bg-white p-5 rounded-2xl">
          {ueberfaellig && ueberfaellig.length > 0 ? (
            <div className="divide-y divide-gray-100">{ueberfaellig.map((t) => renderRow(t, "border-red-400"))}</div>
          ) : (
            <p className="text-xs text-gray-400 py-2">Keine überfälligen Termine.</p>
          )}
        </div>
      )}

      {alle !== undefined && filter === "bald" && (
        <div className="border border-gray-200 bg-white p-5 rounded-2xl">
          {baldFaellig && baldFaellig.length > 0 ? (
            <div className="divide-y divide-gray-100">{baldFaellig.map((t) => renderRow(t, "border-amber-400"))}</div>
          ) : (
            <p className="text-xs text-gray-400 py-2">Keine bald fälligen Termine.</p>
          )}
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
              className="h-9 rounded-lg border border-gray-200 bg-gray-50/50 px-2 text-sm text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
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
                className="h-9 rounded-lg border border-gray-200 bg-gray-50/50 px-2 text-sm text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
              />
              <input
                type="time"
                value={uhrzeit}
                onChange={(e) => setUhrzeit(e.target.value)}
                required
                className="h-9 rounded-lg border border-gray-200 bg-gray-50/50 px-2 text-sm text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
              />
            </div>
            <select
              value={art}
              onChange={(e) => setArt(e.target.value as (typeof CANDIDATE_TERMIN_ARTEN)[number])}
              className="h-9 rounded-lg border border-gray-200 bg-gray-50/50 px-2 text-sm text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
            >
              {CANDIDATE_TERMIN_ARTEN.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            {isAdmin && (
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as "alle" | "nur_ich")}
                className="h-9 rounded-lg border border-gray-200 bg-gray-50/50 px-2 text-sm text-foreground focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
              >
                <option value="alle">Sichtbar für: Alle</option>
                <option value="nur_ich">Sichtbar für: Nur ich</option>
              </select>
            )}
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
