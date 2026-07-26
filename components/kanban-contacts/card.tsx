"use client"

import { memo, useState } from "react"
import { useRouter } from "next/navigation"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "framer-motion"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import { X, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
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

type Contact = Doc<"contacts">

const THEMES: Record<string, { initials: string; border: string }> = {
  "Neue Anfrage": { initials: "bg-violet-100 text-violet-700", border: "border-l-violet-400" },
  Kontaktiert: { initials: "bg-blue-100 text-blue-700", border: "border-l-blue-400" },
  Gespräch: { initials: "bg-amber-100 text-amber-700", border: "border-l-amber-400" },
  Angebot: { initials: "bg-orange-100 text-orange-700", border: "border-l-orange-400" },
  Vertrag: { initials: "bg-emerald-100 text-emerald-700", border: "border-l-emerald-400" },
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

function areContactsEqual(
  a: { contact: Contact; isNew?: boolean },
  b: { contact: Contact; isNew?: boolean }
) {
  return a.contact._id === b.contact._id
    && a.contact.status === b.contact.status
    && a.contact.position === b.contact.position
    && a.contact.name === b.contact.name
    && a.contact.email === b.contact.email
    && a.contact.einrichtung === b.contact.einrichtung
    && a.isNew === b.isNew
}

export const KanbanCard = memo(function KanbanCard({ contact, isNew }: { contact: Contact; isNew?: boolean }) {
  const router = useRouter()
  const deleteContact = useMutation(api.contacts.remove)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: contact._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteContact({ id: contact._id })
      setConfirmOpen(false)
    } finally {
      setDeleting(false)
    }
  }

  const status = contact.status ?? "Neue Anfrage"
  const theme = THEMES[status] ?? THEMES["Neue Anfrage"]
  const date = new Date(contact._creationTime).toLocaleDateString("de-DE", {
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
      onDoubleClick={() => router.push(`/dashboard/contacts/${contact._id}`)}
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
          {isNew && (
            <span
              className="flex size-1.5 shrink-0 rounded-full bg-secondary"
              aria-label="Neu"
              title="Neu"
            />
          )}
          <Link
            href={`/dashboard/contacts/${contact._id}`}
            onClick={(e) => e.stopPropagation()}
            className="font-heading text-sm font-bold text-gray-900 hover:text-primary transition-colors leading-snug line-clamp-1 tracking-tight"
          >
            {contact.einrichtung || contact.name}
          </Link>
          <Link
            href={`/dashboard/contacts/${contact._id}`}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 flex items-center justify-center size-4 text-gray-300 hover:text-primary transition-colors"
            aria-label={`${contact.einrichtung || contact.name} bearbeiten`}
          >
            <Pencil className="size-3" aria-hidden="true" />
          </Link>
        </div>

        <button
          type="button"
          onClick={handleDeleteClick}
          className="shrink-0 flex items-center justify-center size-4 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all -mr-0.5 -mt-0.5 focus-visible:ring-2 focus-visible:ring-red-400/50"
          aria-label={`${contact.einrichtung || contact.name} löschen`}
        >
          <X className="size-3" aria-hidden="true" />
        </button>
      </div>

      {/* Ansprechperson */}
      {contact.einrichtung && (
        <p className="text-[11px] font-semibold text-gray-500 mt-1 leading-relaxed truncate">
          {contact.name}
        </p>
      )}

      {/* Email */}
      {contact.email && (
        <p className="text-[11px] text-gray-400/80 mt-0.5 leading-relaxed truncate">
          {contact.email}
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
            {getInitials(contact.einrichtung || contact.name)}
          </span>
          <span className="text-[10px] font-medium text-gray-400/70 truncate">
            {date}
          </span>
        </div>

        {contact.telefon && (
          <span className="shrink-0 inline-flex items-center border border-gray-200/70 bg-gray-50/80 px-1.5 py-[3px] text-[9px] font-semibold text-gray-500/80 leading-none">
            {contact.telefon}
          </span>
        )}
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Einrichtung in den Papierkorb verschieben?</DialogTitle>
            <DialogDescription>
              &quot;{contact.einrichtung || contact.name}&quot; wird in den Papierkorb verschoben und aus der Pipeline entfernt. Du kannst sie dort jederzeit wiederherstellen oder endgültig löschen.
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
}, areContactsEqual)
