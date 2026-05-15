"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import { FileText, Download, Trash2, Loader2, FolderOpen } from "lucide-react"
import type { Doc, Id } from "@/convex/_generated/dataModel"

interface DocumentListItem extends Doc<"documents"> {
  url: string | null
  candidateName: string
}

export default function DocumentsPage() {
  const allDocs = useQuery(api.documents.listAll) as DocumentListItem[] | undefined
  const deleteDocument = useMutation(api.documents.remove)

  if (allDocs === undefined) {
    return (
      <div className="space-y-6 pb-8">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center bg-primary/5 ring-1 ring-primary/10">
            <FileText className="size-4 text-primary" />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">Documents</h1>
            <p className="text-[11px] font-medium text-muted-foreground/70">Loading documents...</p>
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
          <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">Documents</h1>
          <p className="text-[11px] font-medium text-muted-foreground/70">
            {allDocs.length} document{allDocs.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {allDocs.length > 0 ? (
        <div className="border border-gray-200 bg-white">
          <div className="divide-y divide-gray-100">
            {allDocs.map((doc) => (
              <div key={doc._id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50 transition-colors">
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
                    onClick={() => deleteDocument({ id: doc._id })}
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
            <p className="text-sm font-medium text-gray-400">No documents yet</p>
            <p className="text-xs text-gray-300 mt-1">Upload documents from a candidate&apos;s profile</p>
          </div>
        </div>
      )}
    </div>
  )
}
