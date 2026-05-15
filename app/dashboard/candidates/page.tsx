"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { KanbanBoard } from "@/components/kanban/board"
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
import { LayoutPanelTop, Loader2 } from "lucide-react"

function BoardSkeleton() {
  return (
    <div className="rounded-2xl border bg-white shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)] animate-pulse">
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border/40">
        <div className="h-9 w-[240px] rounded-lg bg-muted/30" />
      </div>
      <div className="flex gap-4 p-5 overflow-x-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex w-[380px] shrink-0 flex-col rounded-xl border border-border/50 h-[calc(100vh-280px)]">
            <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
              <div className="size-2 rounded-full bg-muted-foreground/10" />
              <div className="h-4 w-24 rounded bg-muted-foreground/10" />
              <div className="size-5 rounded-full bg-muted-foreground/10" />
            </div>
            <div className="flex flex-col gap-2 px-3 flex-1">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="rounded-xl border bg-white p-3.5">
                  <div className="flex items-start gap-2.5">
                    <div className="size-3.5 rounded bg-muted-foreground/5 shrink-0 mt-1" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-muted-foreground/10" />
                      <div className="h-3 w-1/2 rounded bg-muted-foreground/5" />
                      <div className="h-3 w-1/3 rounded bg-muted-foreground/5" />
                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-border/40">
                        <div className="size-6 rounded-full bg-muted-foreground/10" />
                        <div className="h-3 w-14 rounded bg-muted-foreground/5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CandidatesPage() {
  const candidates = useQuery(api.candidates.list)
  const createCandidate = useMutation(api.candidates.create)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("Neue Bewerbung")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [telefon, setTelefon] = useState("")
  const [source, setSource] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleAddCandidate = (status: string) => {
    setSelectedStatus(status)
    setName("")
    setEmail("")
    setTelefon("")
    setSource("")
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) return
    setSubmitting(true)
    try {
      await createCandidate({ name, email, telefon, source, lang: "de" })
      setDialogOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/5">
            <LayoutPanelTop className="size-4 text-primary" />
          </span>
          Candidates
        </h1>
        <p className="text-sm text-muted-foreground/70 mt-1.5 ml-[42px]">
          Pipeline overview — drag and drop to update status
        </p>
      </div>

      {candidates === undefined ? <BoardSkeleton /> : (
        <KanbanBoard candidates={candidates} onAddCandidate={handleAddCandidate} />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Candidate</DialogTitle>
            <DialogDescription>
              New candidate will be added to &quot;{selectedStatus}&quot;
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
              type="email"
              placeholder="Email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="tel"
              placeholder="Phone"
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
            />
            <Input
              placeholder="Source (e.g. LinkedIn, Website)"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />

            <DialogFooter>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="size-4 animate-spin" />}
                Add Candidate
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
