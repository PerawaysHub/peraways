"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, User, Mail, Phone, MessageSquare, Globe, Tag, FileText, ChevronDown, Upload, Download, Trash2, Clock, Plus, ArrowRightCircle, FileUp, Activity } from "lucide-react"
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
import { CANDIDATE_STATUSES } from "@/convex/schema"
import { useRef, useState, useCallback } from "react"
import type { Id } from "@/convex/_generated/dataModel"

const STATUS_COLORS: Record<string, string> = {
  "Neue Bewerbung": "bg-violet-100 text-violet-700 border-violet-200",
  Kontaktiert: "bg-blue-100 text-blue-700 border-blue-200",
  Gespräch: "bg-amber-100 text-amber-700 border-amber-200",
  Angebot: "bg-orange-100 text-orange-700 border-orange-200",
  Visum: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Gestartet: "bg-primary/10 text-primary border-primary/20",
}

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  created: Plus,
  status_change: ArrowRightCircle,
  note_added: MessageSquare,
  document_uploaded: FileUp,
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
  const router = useRouter()
  const id = params.id as Id<"candidates">
  const candidate = useQuery(api.candidates.getById, { id })
  const documents = useQuery(api.documents.listByCandidate, { candidateId: id })
  const activityLog = useQuery(api.activityLog.listByCandidate, { candidateId: id })
  const updateNotes = useMutation(api.candidates.updateNotes)
  const updateStatus = useMutation(api.candidates.updateStatus)
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl)
  const saveDocument = useMutation(api.documents.saveDocument)
  const deleteDocument = useMutation(api.documents.remove)
  const deleteCandidate = useMutation(api.candidates.remove)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [notesDraft, setNotesDraft] = useState("")
  const [saving, setSaving] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [docType, setDocType] = useState("cv")
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const statusRef = useRef<HTMLDivElement>(null)

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const uploadUrl = await generateUploadUrl()
      const resp = await fetch(uploadUrl, { method: "POST", body: file })
      const { storageId } = await resp.json()
      await saveDocument({ candidateId: id, name: file.name, type: docType, storageId })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }, [id, docType, generateUploadUrl, saveDocument])

  const handleDeleteDoc = useCallback(async (docId: Id<"documents">) => {
    await deleteDocument({ id: docId })
  }, [deleteDocument])

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
        <p className="mt-4 text-sm font-medium text-muted-foreground">Kandidat nicht gefunden</p>
        <Link href="/dashboard/candidates" className="mt-2 text-sm text-primary hover:underline">
          Zurück zu Kandidaten
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

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteCandidate({ id: candidate._id })
      router.push("/dashboard/candidates")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/candidates"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft className="size-4" />
          Zurück zu Kandidaten
        </Link>
        <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)} className="gap-1.5">
          <Trash2 className="size-3.5" />
          Löschen
        </Button>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">{candidate.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Hinzugefügt am {new Date(candidate._creationTime).toLocaleDateString("de-DE")}
          </p>
        </div>
      </div>

      <div className="grid gap-4 border border-gray-200 bg-white p-5 sm:grid-cols-2">
        <DetailRow icon={User} label="Name" value={candidate.name} />
        <DetailRow icon={Mail} label="E-Mail" value={candidate.email} />
        <DetailRow icon={Phone} label="Telefon" value={candidate.telefon || "—"} />
        <DetailRow icon={Tag} label="Quelle" value={candidate.source || "—"} />
        <DetailRow icon={Globe} label="Sprache" value={candidate.lang.toUpperCase()} />
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
        <div className="flex items-center gap-2 mb-4">
          <Upload className="size-4 text-primary" />
          <h2 className="font-heading text-sm font-bold text-foreground tracking-tight">Dokumente</h2>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="h-8 border border-gray-200 bg-gray-50/80 px-2 text-xs font-medium text-gray-600 focus:outline-none focus:border-primary/30 focus:ring-[1.5px] focus:ring-primary/15"
          >
            <option value="cv">Lebenslauf</option>
            <option value="zeugnis">Zeugnis</option>
            <option value="sonstiges">Sonstiges</option>
          </select>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleUpload}
            className="hidden"
          />
          <Button
            type="button"
            size="sm"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="text-xs gap-1.5 h-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
            {uploading ? "Wird hochgeladen..." : "Hochladen"}
          </Button>
        </div>

        {documents === undefined ? (
          <div className="h-8 flex items-center">
            <Loader2 className="size-3.5 animate-spin text-gray-400" />
          </div>
        ) : documents.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {documents.map((doc) => (
              <div key={doc._id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="size-4 text-gray-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                    <p className="text-[10px] font-medium text-gray-400 uppercase">{doc.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center size-7 text-gray-400 hover:text-primary transition-colors"
                    >
                      <Download className="size-3.5" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteDoc(doc._id)}
                    className="flex items-center justify-center size-7 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 py-2">Noch keine Dokumente hochgeladen.</p>
        )}
      </div>

      <div className="border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="size-4 text-primary" />
          <h2 className="font-heading text-sm font-bold text-foreground tracking-tight">Notizen</h2>
        </div>
        <Textarea
          placeholder="Notizen zu diesem Kandidaten hinzufügen..."
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
          Notizen speichern
        </Button>
      </div>

      <div className="border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="size-4 text-primary" />
          <h2 className="font-heading text-sm font-bold text-foreground tracking-tight">Verlauf</h2>
        </div>

        {activityLog === undefined ? (
          <div className="h-8 flex items-center">
            <Loader2 className="size-3.5 animate-spin text-gray-400" />
          </div>
        ) : activityLog.length > 0 ? (
          <div className="relative pl-5 before:absolute before:left-[7px] before:top-1 before:bottom-1 before:w-px before:bg-gray-200">
            {activityLog.map((entry) => {
              const Icon = ACTIVITY_ICONS[entry.type] ?? Clock
              return (
                <div key={entry._id} className="relative pb-4 last:pb-0">
                  <span className="absolute -left-[13px] flex size-[14px] items-center justify-center bg-white">
                    <Icon className="size-3 text-gray-400" />
                  </span>
                  <p className="text-sm text-gray-700">{entry.description}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {new Date(entry.timestamp).toLocaleString("de-DE")}
                  </p>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-400 py-2">Noch keine Aktivität.</p>
        )}
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kandidat löschen</DialogTitle>
            <DialogDescription>
              Bist du sicher, dass du diesen Kandidaten löschen möchtest? Alle Dokumente und der Verlauf werden mitgelöscht. Das kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Abbrechen
            </Button>
            <Button variant="destructive" disabled={deleting} onClick={handleDelete}>
              {deleting && <Loader2 className="size-4 animate-spin" />}
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
