"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import { FileText, Download, Trash2, Loader2, FolderOpen } from "lucide-react"
import type { Id } from "@/convex/_generated/dataModel"

type MergedDoc = {
  _id: string
  kind: "document" | "compliance"
  candidateId: Id<"candidates">
  candidateName: string
  name: string
  type: string
  docType?: string
  uploadedAt: number
  url: string | null
}

export default function DocumentsPage() {
  const documents = useQuery(api.documents.listAll)
  const complianceDocs = useQuery(api.complianceDocuments.listAllUploaded)
  const deleteDocument = useMutation(api.documents.remove)
  const removeComplianceDocument = useMutation(api.complianceDocuments.removeDocument)

  const loading = documents === undefined || complianceDocs === undefined

  const allDocs: MergedDoc[] = loading
    ? []
    : [
        ...documents.map((d) => ({
          _id: d._id,
          kind: "document" as const,
          candidateId: d.candidateId,
          candidateName: d.candidateName,
          name: d.name,
          type: d.type,
          uploadedAt: d.uploadedAt,
          url: d.url,
        })),
        ...complianceDocs.map((d) => ({
          _id: d._id,
          kind: "compliance" as const,
          candidateId: d.candidateId,
          candidateName: d.candidateName,
          name: d.name,
          type: "Compliance",
          docType: d.docType,
          uploadedAt: d.uploadedAt,
          url: d.url,
        })),
      ].sort((a, b) => b.uploadedAt - a.uploadedAt)

  const handleDelete = (doc: MergedDoc) => {
    if (doc.kind === "compliance" && doc.docType) {
      removeComplianceDocument({ candidateId: doc.candidateId, docType: doc.docType })
    } else {
      deleteDocument({ id: doc._id as Id<"documents"> })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 pb-8">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center bg-primary/5 ring-1 ring-primary/10">
            <FileText className="size-4 text-primary" />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">Dokumente</h1>
            <p className="text-[11px] font-medium text-muted-foreground/70">Dokumente werden geladen...</p>
          </div>
        </div>
        <div className="border border-gray-200 bg-white p-5">
          <div className="h-8 flex items-center">
            <Loader2 className="size-4 animate-spin text-gray-400" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center bg-primary/5 ring-1 ring-primary/10">
          <FileText className="size-4 text-primary" />
        </span>
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">Dokumente</h1>
          <p className="text-[11px] font-medium text-muted-foreground/70">
            {allDocs.length} Dokument{allDocs.length !== 1 ? "e" : ""}
          </p>
        </div>
      </div>

      {allDocs.length > 0 ? (
        <div className="border border-gray-200 bg-white">
          <div className="divide-y divide-gray-100">
            {allDocs.map((doc) => (
              <div key={`${doc.kind}-${doc._id}`} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex size-8 items-center justify-center bg-primary/5 shrink-0">
                    <FileText className="size-4 text-primary" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/candidates/${doc.candidateId}`}
                        className="text-sm font-medium text-gray-900 hover:text-primary transition-colors truncate"
                      >
                        {doc.candidateName}
                      </Link>
                      <span className="text-[10px] font-semibold text-gray-400 uppercase border border-gray-200 px-1 py-px leading-none">{doc.type}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{doc.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-gray-400 tabular-nums hidden sm:block">
                    {new Date(doc.uploadedAt).toLocaleDateString("de-DE")}
                  </span>
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
                    onClick={() => handleDelete(doc)}
                    className="flex items-center justify-center size-7 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="border border-gray-200 bg-white p-5">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FolderOpen className="size-10 text-gray-200 mb-3" />
            <p className="text-sm font-medium text-gray-400">Noch keine Dokumente</p>
            <p className="text-xs text-gray-300 mt-1">Dokumente können im Profil eines Kandidaten hochgeladen werden</p>
          </div>
        </div>
      )}
    </div>
  )
}
