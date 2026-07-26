"use client";

import { useState } from "react"
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { KanbanBoard } from "@/components/kanban-contacts/board"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, MessageSquare } from "lucide-react";

function BoardSkeleton() {
  return (
    <div className="rounded-2xl border bg-white shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)] animate-pulse">
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border/40">
        <div className="h-9 w-[240px] rounded-lg bg-muted/30" />
      </div>
      <div className="flex gap-4 p-5 overflow-x-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex w-[280px] shrink-0 flex-col rounded-xl border border-border/50 h-[calc(100vh-280px)]">
            <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
              <div className="size-2 rounded-full bg-muted-foreground/10" />
              <div className="h-4 w-24 rounded bg-muted-foreground/10" />
              <div className="size-5 rounded-full bg-muted-foreground/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ContactsPage() {
  const contacts = useQuery(api.contacts.list);
  const unread = useQuery(api.notifications.listUnread);
  const createContact = useMutation(api.contacts.create)

  const newContactIds = new Set(
    (unread ?? [])
      .filter((n) => n.type === "new_contact" && n.relatedId)
      .map((n) => n.relatedId as string)
  )

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("Neue Anfrage")
  const [name, setName] = useState("")
  const [einrichtung, setEinrichtung] = useState("")
  const [email, setEmail] = useState("")
  const [telefon, setTelefon] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleAddContact = (status: string) => {
    setSelectedStatus(status)
    setName("")
    setEinrichtung("")
    setEmail("")
    setTelefon("")
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return
    setSubmitting(true)
    try {
      await createContact({ name, email, telefon, einrichtung })
      setDialogOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/5 ring-1 ring-primary/10">
          <MessageSquare className="size-4 text-primary" />
        </span>
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">Einrichtungen</h1>
          <p className="text-[11px] font-medium text-muted-foreground/70">
            Alle Anfragen von Pflegeeinrichtungen — per Drag & Drop durch die Pipeline ziehen
          </p>
        </div>
      </div>

      {contacts === undefined ? <BoardSkeleton /> : (
        <KanbanBoard contacts={contacts} onAddContact={handleAddContact} newContactIds={newContactIds} />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Einrichtung hinzufügen</DialogTitle>
            <DialogDescription>
              Wird zu &quot;{selectedStatus}&quot; hinzugefügt
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              placeholder="Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              placeholder="Einrichtung"
              value={einrichtung}
              onChange={(e) => setEinrichtung(e.target.value)}
            />
            <Input
              type="email"
              placeholder="E-Mail *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="tel"
              placeholder="Telefon"
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
            />

            <DialogFooter>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="size-4 animate-spin" />}
                Einrichtung hinzufügen
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
