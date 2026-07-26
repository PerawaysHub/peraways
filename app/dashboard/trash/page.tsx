"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Trash2, RotateCcw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import type { Doc } from "@/convex/_generated/dataModel"

type TrashItem =
  | { kind: "contact"; doc: Doc<"contacts"> }
  | { kind: "candidate"; doc: Doc<"candidates"> }

export default function TrashPage() {
  const deletedContacts = useQuery(api.contacts.listDeleted)
  const deletedCandidates = useQuery(api.candidates.listDeleted)
  const restoreContact = useMutation(api.contacts.restore)
  const restoreCandidate = useMutation(api.candidates.restore)
  const permanentlyDeleteContact = useMutation(api.contacts.permanentlyDelete)
  const permanentlyDeleteCandidate = useMutation(api.candidates.permanentlyDelete)

  const [restoring, setRestoring] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<TrashItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loading = deletedContacts === undefined || deletedCandidates === undefined

  const items: TrashItem[] = loading
    ? []
    : [
        ...deletedContacts!.map((doc) => ({ kind: "contact" as const, doc })),
        ...deletedCandidates!.map((doc) => ({ kind: "candidate" as const, doc })),
      ].sort((a, b) => (b.doc.deletedAt ?? 0) - (a.doc.deletedAt ?? 0))

  const handleRestore = async (item: TrashItem) => {
    setRestoring(item.doc._id)
    try {
      if (item.kind === "contact") {
        await restoreContact({ id: item.doc._id })
      } else {
        await restoreCandidate({ id: item.doc._id })
      }
    } finally {
      setRestoring(null)
    }
  }

  const handlePermanentDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      if (deleteTarget.kind === "contact") {
        await permanentlyDeleteContact({ id: deleteTarget.doc._id })
      } else {
        await permanentlyDeleteCandidate({ id: deleteTarget.doc._id })
      }
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/5">
            <Trash2 className="size-4 text-primary" />
          </span>
          Papierkorb
        </h1>
        <p className="text-sm text-muted-foreground/70 mt-1.5 ml-[42px]">
          Gelöschte Einrichtungen und Talente — hier wiederherstellen oder endgültig löschen
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Typ</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">E-Mail</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Gelöscht am</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground sr-only">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.doc._id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${
                      item.kind === "candidate"
                        ? "bg-violet-100 text-violet-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {item.kind === "candidate" ? "Talent" : "Einrichtung"}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">{item.doc.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{item.doc.email}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {item.doc.deletedAt
                    ? new Date(item.doc.deletedAt).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={restoring === item.doc._id}
                      onClick={() => handleRestore(item)}
                    >
                      <RotateCcw className="size-3.5" aria-hidden="true" />
                      Wiederherstellen
                    </Button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className="text-muted-foreground hover:text-red-500 transition-colors p-1.5"
                      aria-label={`${item.doc.name} endgültig löschen`}
                      title="Endgültig löschen"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Der Papierkorb ist leer.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Lädt…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="size-5" aria-hidden="true" />
              Endgültig löschen
            </DialogTitle>
            <DialogDescription>
              &quot;{deleteTarget?.doc.name}&quot; wird unwiderruflich gelöscht — inklusive aller zugehörigen
              {deleteTarget?.kind === "candidate" ? " Dokumente, Compliance-Unterlagen, Termine und Finanzdaten" : " Daten"}.
              Diese Aktion kann <strong>nicht</strong> rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Abbrechen
            </Button>
            <Button variant="destructive" disabled={deleting} onClick={handlePermanentDelete}>
              Endgültig löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
