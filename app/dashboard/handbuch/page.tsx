"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { BookOpen, Loader2, Download, Trash2, Plus, FolderOpen, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { ROLE_LABELS } from "@/convex/schema"
import { useLanguage } from "@/components/LanguageContext"
import type { Id } from "@/convex/_generated/dataModel"

const MANAGEABLE_ROLES = ["admin", "editor", "integrationshelfer", "gstc"] as const

function formatDate(ts: number, lang: string) {
  return new Date(ts).toLocaleDateString(lang === "en" ? "en-GB" : "de-DE")
}

export default function HandbuchPage() {
  const { t, lang } = useLanguage()
  const currentUser = useQuery(api.users.getCurrentUser)
  const isAdmin = currentUser?.role === "admin"

  const docsForUser = useQuery(api.handbuch.listForCurrentUser)
  const docsForAdmin = useQuery(api.handbuch.listAllForAdmin, isAdmin ? {} : "skip")
  const generateUploadUrl = useMutation(api.handbuch.generateUploadUrl)
  const createDoc = useMutation(api.handbuch.create)
  const updateVisibility = useMutation(api.handbuch.updateVisibility)
  const removeDoc = useMutation(api.handbuch.remove)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [roles, setRoles] = useState<string[]>(["admin", "editor", "integrationshelfer"])
  const [submitting, setSubmitting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Id<"handbuchDocuments"> | null>(null)
  const [deleting, setDeleting] = useState(false)

  const openDialog = () => {
    setTitle("")
    setDescription("")
    setFile(null)
    setRoles(["admin", "editor", "integrationshelfer"])
    setDialogOpen(true)
  }

  const toggleRole = (role: string) => {
    setRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]))
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !file) return
    setSubmitting(true)
    try {
      const uploadUrl = await generateUploadUrl()
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      })
      const { storageId } = await result.json()
      await createDoc({ title, description: description || undefined, storageId, visibleToRoles: roles })
      setDialogOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await removeDoc({ id: deleteTarget })
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const loading = isAdmin ? docsForAdmin === undefined : docsForUser === undefined

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center bg-primary/5 ring-1 ring-primary/10 rounded-lg">
            <BookOpen className="size-4 text-primary" />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">{t("Handbuch", "Handbook")}</h1>
            <p className="text-[11px] font-medium text-muted-foreground/70">
              {t("Interne Anleitungen und Richtlinien", "Internal guides and policies")}
            </p>
          </div>
        </div>
        {isAdmin && (
          <Button size="sm" onClick={openDialog} className="text-xs gap-1.5 h-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
            <Plus className="size-3.5" />
            {t("Dokument hochladen", "Upload document")}
          </Button>
        )}
      </div>

      {loading ? (
        <div className="border border-gray-200 bg-white p-5 rounded-2xl">
          <div className="h-8 flex items-center">
            <Loader2 className="size-3.5 animate-spin text-gray-400" />
          </div>
        </div>
      ) : isAdmin ? (
        <div className="border border-gray-200 bg-white divide-y divide-gray-100 rounded-2xl overflow-hidden">
          {docsForAdmin && docsForAdmin.length > 0 ? (
            docsForAdmin.map((doc) => (
              <div key={doc._id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{doc.title}</p>
                    {doc.description && <p className="text-xs text-gray-500 mt-0.5">{doc.description}</p>}
                    <p className="text-[11px] text-gray-400 mt-1">{formatDate(doc.uploadedAt, lang)}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
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
                      onClick={() => setDeleteTarget(doc._id)}
                      className="flex items-center justify-center size-7 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {MANAGEABLE_ROLES.map((role) => {
                    const active = doc.visibleToRoles.includes(role)
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() =>
                          updateVisibility({
                            id: doc._id,
                            visibleToRoles: active
                              ? doc.visibleToRoles.filter((r) => r !== role)
                              : [...doc.visibleToRoles, role],
                          })
                        }
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-gray-200 bg-gray-50/80 text-gray-500 hover:border-gray-300"
                        }`}
                      >
                        {ROLE_LABELS[role] ?? role}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FolderOpen className="size-10 text-gray-200 mb-3" />
              <p className="text-sm font-medium text-gray-400">{t("Noch keine Dokumente", "No documents yet")}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-gray-200 bg-white divide-y divide-gray-100 rounded-2xl overflow-hidden">
          {docsForUser && docsForUser.length > 0 ? (
            docsForUser.map((doc) => (
              <div key={doc._id} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{doc.title}</p>
                  {doc.description && <p className="text-xs text-gray-500 mt-0.5">{doc.description}</p>}
                  <p className="text-[11px] text-gray-400 mt-1">{formatDate(doc.uploadedAt, lang)}</p>
                </div>
                {doc.url && (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center size-8 shrink-0 text-gray-400 hover:text-primary transition-colors"
                  >
                    <Download className="size-4" />
                  </a>
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FolderOpen className="size-10 text-gray-200 mb-3" />
              <p className="text-sm font-medium text-gray-400">{t("Noch keine Dokumente für dich freigegeben", "No documents shared with you yet")}</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Dokument hochladen", "Upload document")}</DialogTitle>
            <DialogDescription>
              {t("Lege fest, welche Rollen dieses Dokument sehen dürfen.", "Choose which roles are allowed to see this document.")}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpload} className="flex flex-col gap-3">
            <Input
              placeholder={t("Titel *", "Title *")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              placeholder={t("Beschreibung (optional)", "Description (optional)")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              required
              className="text-xs"
            />

            <div>
              <p className="text-xs font-medium text-muted-foreground/70 mb-1.5">
                {t("Sichtbar für", "Visible to")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {MANAGEABLE_ROLES.map((role) => {
                  const active = roles.includes(role)
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => toggleRole(role)}
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-gray-200 bg-gray-50/80 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {ROLE_LABELS[role] ?? role}
                    </button>
                  )
                })}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="size-4 animate-spin" />}
                {t("Hochladen", "Upload")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Dokument löschen?", "Delete document?")}</DialogTitle>
            <DialogDescription>
              {t("Das Dokument wird unwiderruflich gelöscht.", "This document will be permanently deleted.")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              <X className="size-3.5" />
              {t("Abbrechen", "Cancel")}
            </Button>
            <Button variant="destructive" disabled={deleting} onClick={handleDelete}>
              {t("Löschen", "Delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
