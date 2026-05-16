"use client"

import { memo } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "framer-motion"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Doc } from "@/convex/_generated/dataModel"

type Candidate = Doc<"candidates">

const THEMES: Record<string, { initials: string; border: string }> = {
  "Neue Bewerbung": { initials: "bg-violet-100 text-violet-700", border: "border-l-violet-400" },
  Kontaktiert: { initials: "bg-blue-100 text-blue-700", border: "border-l-blue-400" },
  Gespräch: { initials: "bg-amber-100 text-amber-700", border: "border-l-amber-400" },
  Angebot: { initials: "bg-orange-100 text-orange-700", border: "border-l-orange-400" },
  Visum: { initials: "bg-emerald-100 text-emerald-700", border: "border-l-emerald-400" },
  Gestartet: { initials: "bg-primary/10 text-primary", border: "border-l-primary" },
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
    && a.candidate.source === b.candidate.source
    && a.candidate.notes === b.candidate.notes
}

export const KanbanCard = memo(function KanbanCard({ candidate }: { candidate: Candidate }) {
  const deleteCandidate = useMutation(api.candidates.remove)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await deleteCandidate({ id: candidate._id })
  }

  const theme = THEMES[candidate.status] ?? THEMES["Neue Bewerbung"]
  const date = new Date(candidate._creationTime).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
  })

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
      className={cn(
        "group bg-white border border-gray-200/80 border-l-[3px] px-3 md:px-3.5 py-2.5 md:py-3 cursor-grab active:cursor-grabbing select-none",
        "shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]",
        "hover:border-gray-300 hover:shadow-sm transition-all duration-150",
        theme.border,
        isDragging && "opacity-30 ring-2 ring-primary/20 ring-inset"
      )}
    >
      {/* Top row: name + delete */}
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/dashboard/candidates/${candidate._id}`}
          onClick={(e) => e.stopPropagation()}
          className="font-heading text-sm font-bold text-gray-900 hover:text-primary transition-colors leading-snug line-clamp-1 tracking-tight"
        >
          {candidate.name}
        </Link>

        <button
          type="button"
          onClick={handleDelete}
          className="shrink-0 flex items-center justify-center size-4 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all -mr-0.5 -mt-0.5 focus-visible:ring-2 focus-visible:ring-red-400/50"
          aria-label={`Delete ${candidate.name}`}
        >
          <X className="size-3" aria-hidden="true" />
        </button>
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
          <span
            className={cn(
              "flex size-[18px] shrink-0 items-center justify-center text-[8px] font-bold leading-none",
              theme.initials
            )}
          >
            {getInitials(candidate.name)}
          </span>
          <span className="text-[10px] font-medium text-gray-400/70 truncate">
            {date}
          </span>
        </div>

        {candidate.source && (
          <span className="shrink-0 inline-flex items-center border border-gray-200/70 bg-gray-50/80 px-1.5 py-[3px] text-[9px] font-semibold text-gray-500/80 leading-none">
            {candidate.source}
          </span>
        )}
      </div>
    </motion.div>
  )
})
