"use client"

import { memo, useState } from "react"
import { useRouter } from "next/navigation"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "framer-motion"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import { X, ShieldCheck, Pencil, AlertTriangle } from "lucide-react"
import { cn, daysUntil, probezeitEnde } from "@/lib/utils"
import { useLanguage } from "@/components/LanguageContext"
import type { Doc } from "@/convex/_generated/dataModel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type Candidate = Doc<"candidates">

const THEMES: Record<string, { initials: string; border: string }> = {
  Qualifizierung: { initials: "bg-violet-100 text-violet-700", border: "border-l-violet-400" },
  "LEA-Fast-Lane": { initials: "bg-blue-100 text-blue-700", border: "border-l-blue-400" },
  Visum: { initials: "bg-amber-100 text-amber-700", border: "border-l-amber-400" },
  "Onboarding / Berlin-Phase": { initials: "bg-orange-100 text-orange-700", border: "border-l-orange-400" },
  Abgeschlossen: { initials: "bg-primary/10 text-primary", border: "border-l-primary" },
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function areCandidatesEqual(a: { candidate: Candidate }, b: { candidate: Candidate }) {
  return a.candidate._id === b.candidate._id
    && a.candidate.status === b.candidate.status
    && a.candidate.position === b.candidate.position
    && a.candidate.name === b.candidate.name
    && a.candidate.email === b.candidate.email
    && a.candidate.notes === b.candidate.notes
    && a.candidate.ablaufdatumVisum === b.candidate.ablaufdatumVisum
    && a.candidate.ersterArbeitstag === b.candidate.ersterArbeitstag
}

function getFristenBadge(candidate: Candidate) {
  const options = [
    { days: daysUntil(candidate.ablaufdatumVisum), label: "Visum" },
    { days: daysUntil(probezeitEnde(candidate.ersterArbeitstag)), label: "Probezeit" },
  ].filter((o): o is { days: number; label: string } => o.days !== null)
  if (options.length === 0) return null
  const soonest = options.reduce((a, b) => (b.days < a.days ? b : a))
  return soonest.days <= 30 ? soonest : null
}

export const KanbanCard = memo(function KanbanCard({ candidate }: { candidate: Candidate }) {
  const router = useRouter()
  const { t } = useLanguage()
  const currentUser = useQuery(api.users.getCurrentUser)
  const isGstc = currentUser?.role === "gstc"
  const deleteCandidate = useMutation(api.candidates.remove)
  const complianceSummary = useQuery(api.complianceDocuments.getComplianceSummary, { candidateId: candidate._id })
  const avatarUrl = useQuery(api.candidates.getAvatarUrl, { candidateId: candidate._id })
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate._id, disabled: isGstc })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteCandidate({ id: candidate._id })
      setConfirmOpen(false)
    } finally {
      setDeleting(false)
    }
  }

  const theme = THEMES[candidate.status] ?? THEMES["Qualifizierung"]
  const date = new Date(candidate._creationTime).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
  })
  const fristenBadge = getFristenBadge(candidate)

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      onDoubleClick={() => router.push(`/dashboard/candidates/${candidate._id}`)}
      className={cn(
        "group bg-white border border-gray-200/80 border-l-[3px] rounded-xl px-3 md:px-3.5 py-2.5 md:py-3 cursor-grab active:cursor-grabbing select-none",
        "shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]",
        "hover:border-gray-300 hover:shadow-sm transition-all duration-150",
        theme.border,
        isDragging && "opacity-30 ring-2 ring-primary/20 ring-inset"
      )}
    >
      {/* Top row: name + edit + delete */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Link
            href={`/dashboard/candidates/${candidate._id}`}
            onClick={(e) => e.stopPropagation()}
            className="font-heading text-sm font-bold text-gray-900 hover:text-primary transition-colors leading-snug line-clamp-1 tracking-tight"
          >
            {candidate.name}
          </Link>
          <Link
            href={`/dashboard/candidates/${candidate._id}`}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 flex items-center justify-center size-4 text-gray-300 hover:text-primary transition-colors"
            aria-label={t(`${candidate.name} bearbeiten`, `Edit ${candidate.name}`)}
          >
            <Pencil className="size-3" aria-hidden="true" />
          </Link>
        </div>

        {!isGstc && (
          <button
            type="button"
            onClick={handleDeleteClick}
            className="shrink-0 flex items-center justify-center size-4 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all -mr-0.5 -mt-0.5 focus-visible:ring-2 focus-visible:ring-red-400/50"
            aria-label={`${candidate.name} löschen`}
          >
            <X className="size-3" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Email */}
      {candidate.email && (
        <p className="text-[11px] text-gray-400/80 mt-1.5 leading-relaxed truncate">
          {candidate.email}
        </p>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-100/70">
        <div className="flex items-center gap-2 min-w-0">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={candidate.name}
              className="size-[18px] shrink-0 rounded-full object-cover"
            />
          ) : (
            <span
              className={cn(
                "flex size-[18px] shrink-0 items-center justify-center text-[8px] font-bold leading-none",
                theme.initials
              )}
            >
              {getInitials(candidate.name)}
            </span>
          )}
          <span className="text-[10px] font-medium text-gray-400/70 truncate">
            {date}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {fristenBadge && (
            <span
              className={cn(
                "inline-flex items-center gap-1 border px-1.5 py-[3px] text-[9px] font-semibold leading-none",
                fristenBadge.days <= 0
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-amber-200 bg-amber-50 text-amber-700"
              )}
            >
              <AlertTriangle className="size-2.5" />
              {fristenBadge.label} {fristenBadge.days <= 0 ? "abgelaufen" : `${fristenBadge.days}d`}
            </span>
          )}
          {complianceSummary && (
            complianceSummary.allReceived ? (
              <span className="inline-flex items-center gap-1 border border-emerald-200 bg-emerald-50 px-1.5 py-[3px] text-[9px] font-semibold text-emerald-700 leading-none">
                <ShieldCheck className="size-2.5" />
                Ready for LEA
              </span>
            ) : (
              <span className="inline-flex items-center border border-gray-200/70 bg-gray-50/80 px-1.5 py-[3px] text-[9px] font-semibold text-gray-500/80 leading-none">
                {complianceSummary.receivedCount}/{complianceSummary.totalCount}
              </span>
            )
          )}
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Talent in den Papierkorb verschieben?</DialogTitle>
            <DialogDescription>
              &quot;{candidate.name}&quot; wird in den Papierkorb verschoben und aus der Pipeline entfernt. Du kannst es dort jederzeit wiederherstellen oder endgültig löschen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Abbrechen
            </Button>
            <Button variant="destructive" disabled={deleting} onClick={handleConfirmDelete}>
              In den Papierkorb
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}, areCandidatesEqual)
