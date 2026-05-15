"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, User, Mail, Phone, MessageSquare, Globe, Tag, FileText, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CANDIDATE_STATUSES } from "@/convex/schema"
import { useRef, useState } from "react"
import type { Id } from "@/convex/_generated/dataModel"

const STATUS_COLORS: Record<string, string> = {
  "Neue Bewerbung": "bg-violet-100 text-violet-700 border-violet-200",
  Kontaktiert: "bg-blue-100 text-blue-700 border-blue-200",
  Gespräch: "bg-amber-100 text-amber-700 border-amber-200",
  Angebot: "bg-orange-100 text-orange-700 border-orange-200",
  Visum: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Gestartet: "bg-primary/10 text-primary border-primary/20",
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-8 items-center justify-center bg-primary/5 text-primary ring-1 ring-primary/10">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-muted-foreground/70">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value}</p>
      </div>
    </div>
  )
}

export default function CandidateDetailPage() {
  const params = useParams()
  const id = params.id as Id<"candidates">
  const candidate = useQuery(api.candidates.getById, { id })
  const updateNotes = useMutation(api.candidates.updateNotes)
  const updateStatus = useMutation(api.candidates.updateStatus)
  const [notesDraft, setNotesDraft] = useState("")
  const [saving, setSaving] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const statusRef = useRef<HTMLDivElement>(null)

  if (candidate === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (candidate === null) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <User className="size-10 text-muted-foreground/40" />
        <p className="mt-4 text-sm font-medium text-muted-foreground">Candidate not found</p>
        <Link href="/dashboard/candidates" className="mt-2 text-sm text-primary hover:underline">
          Back to candidates
        </Link>
      </div>
    )
  }

  const handleSaveNotes = async () => {
    setSaving(true)
    try {
      await updateNotes({ id: candidate._id, notes: notesDraft || candidate.notes })
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    setStatusOpen(false)
    if (newStatus === candidate.status) return
    await updateStatus({ id: candidate._id, status: newStatus, position: 0 })
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Link
        href="/dashboard/candidates"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
      >
        <ArrowLeft className="size-4" />
        Back to candidates
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">{candidate.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Added {new Date(candidate._creationTime).toLocaleDateString("de-DE")}
          </p>
        </div>
      </div>

      <div className="grid gap-4 border border-gray-200 bg-white p-5 sm:grid-cols-2">
        <DetailRow icon={User} label="Name" value={candidate.name} />
        <DetailRow icon={Mail} label="Email" value={candidate.email} />
        <DetailRow icon={Phone} label="Phone" value={candidate.telefon || "—"} />
        <DetailRow icon={Tag} label="Source" value={candidate.source || "—"} />
        <DetailRow icon={Globe} label="Language" value={candidate.lang.toUpperCase()} />
      </div>

      <div className="border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="size-4 text-primary" />
          <h2 className="font-heading text-sm font-bold text-foreground tracking-tight">Status</h2>
        </div>

        <div className="relative" ref={statusRef}>
          <button
            type="button"
            onClick={() => setStatusOpen(!statusOpen)}
            className={`flex items-center gap-2 border px-3 py-2 text-sm font-medium transition-all hover:opacity-80 ${
              STATUS_COLORS[candidate.status] ?? "bg-muted text-muted-foreground border-border"
            }`}
          >
            {candidate.status}
            <ChevronDown className={`size-3.5 transition-transform duration-200 ${statusOpen ? "rotate-180" : ""}`} />
          </button>

          {statusOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setStatusOpen(false)} />
              <div className="absolute top-full left-0 mt-1 z-20 w-48 border border-gray-200 bg-white py-1 shadow-sm">
                {CANDIDATE_STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleStatusChange(s)}
                    className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors ${
                      candidate.status === s
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground hover:bg-gray-50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="size-4 text-primary" />
          <h2 className="font-heading text-sm font-bold text-foreground tracking-tight">Notes</h2>
        </div>
        <Textarea
          placeholder="Add notes about this candidate..."
          value={notesDraft || candidate.notes || ""}
          onChange={(e) => setNotesDraft(e.target.value)}
          rows={5}
          className="mb-3 border-gray-200 bg-gray-50/50 text-sm focus-visible:border-primary/30 focus-visible:ring-[1.5px] focus-visible:ring-primary/15"
        />
        <Button
          onClick={handleSaveNotes}
          disabled={saving || notesDraft === candidate.notes}
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm text-xs h-8"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          Save Notes
        </Button>
      </div>
    </div>
  )
}
