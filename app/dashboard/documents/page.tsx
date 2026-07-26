"use client"

import { useMemo, useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import Link from "next/link"
import { FileText, Download, Trash2, Loader2, FolderOpen, ChevronDown } from "lucide-react"
import type { Id } from "@/convex/_generated/dataModel"
import { COMPLIANCE_DOC_TYPES, COMPLIANCE_DOC_LABELS } from "@/convex/schema"

const GENERIC_DOC_LABELS: Record<string, string> = {
  cv: "Lebenslauf",
  zeugnis: "Zeugnis",
  sonstiges: "Sonstiges",
}

const FILTER_OPTIONS = [
  ...Object.entries(GENERIC_DOC_LABELS).map(([key, label]) => ({ key: `generic:${key}`, label })),
  ...COMPLIANCE_DOC_TYPES.map((docType) => ({
    key: `compliance:${docType}`,
    label: COMPLIANCE_DOC_LABELS[docType] ?? docType,
  })),
]

type MergedDoc = {
  _id: string
  kind: "document" | "compliance"
  candidateId: Id<"candidates">
  name: string
  type: string
  docType?: string
  filterKey: string
  uploadedAt: number
  url: string | null
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(ts?: number) {
  if (!ts) return "—"
  return new Date(ts).toLocaleDateString("de-DE")
}

export default function DocumentsPage() {
  const documents = useQuery(api.documents.listAll)
  const complianceDocs = useQuery(api.complianceDocuments.listAllUploaded)
  const candidateSummaries = useQuery(api.candidates.listSummaries)
  const deleteDocument = useMutation(api.documents.remove)
  const removeComplianceDocument = useMutation(api.complianceDocuments.removeDocument)

  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const loading = documents === undefined || complianceDocs === undefined || candidateSummaries === undefined

  const toggleFilter = (key: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const toggleExpanded = (candidateId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(candidateId)) next.delete(candidateId)
      else next.add(candidateId)
      return next
    })
  }

  const allDocs: MergedDoc[] = loading
    ? []
    : [
        ...documents.map((d) => ({
          _id: d._id,
          kind: "document" as const,
          candidateId: d.candidateId,
          name: d.name,
          type: GENERIC_DOC_LABELS[d.type] ?? d.type,
          filterKey: `generic:${d.type}`,
          uploadedAt: d.uploadedAt,
          url: d.url,
        })),
        ...complianceDocs.map((d) => ({
          _id: d._id,
          kind: "compliance" as const,
          candidateId: d.candidateId,
          name: d.name,
          type: "Compliance",
          docType: d.docType,
          filterKey: `compliance:${d.docType}`,
          uploadedAt: d.uploadedAt,
          url: d.url,
        })),
      ]

  const filteredDocs = activeFilters.size === 0
    ? allDocs
    : allDocs.filter((d) => activeFilters.has(d.filterKey))

  const summaryById = useMemo(() => {
    const map = new Map<string, { name: string; geburtsdatum?: number; avatarUrl: string | null }>()
    candidateSummaries?.forEach((c) => map.set(c._id, c))
    return map
  }, [candidateSummaries])

  const groups = useMemo(() => {
    const byCandidateId = new Map<string, MergedDoc[]>()
    for (const doc of filteredDocs) {
      const list = byCandidateId.get(doc.candidateId) ?? []
      list.push(doc)
      byCandidateId.set(doc.candidateId, list)
    }
    return Array.from(byCandidateId.entries())
      .map(([candidateId, docs]) => ({
        candidateId,
        docs: docs.sort((a, b) => b.uploadedAt - a.uploadedAt),
        summary: summaryById.get(candidateId),
        latestUpload: Math.max(...docs.map((d) => d.uploadedAt)),
      }))
      .sort((a, b) => b.latestUpload - a.latestUpload)
  }, [filteredDocs, summaryById])

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
            {groups.length} Talent{groups.length !== 1 ? "e" : ""} · {filteredDocs.length} Dokument{filteredDocs.length !== 1 ? "e" : ""}
          </p>
        </div>
      </div>

      <div className="border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wide">Nach Dokument filtern</p>
          {activeFilters.size > 0 && (
            <button
              type="button"
              onClick={() => setActiveFilters(new Set())}
              className="text-[11px] font-medium text-primary hover:underline"
            >
              Filter zurücksetzen
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTER_OPTIONS.map((opt) => {
            const active = activeFilters.has(opt.key)
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => toggleFilter(opt.key)}
                className={`border px-2 py-1 text-[11px] font-medium transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-gray-200 bg-gray-50/80 text-gray-600 hover:border-gray-300"
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {groups.length > 0 ? (
        <div className="border border-gray-200 bg-white divide-y divide-gray-100">
          {groups.map(({ candidateId, docs, summary }) => {
            const isExpanded = expanded.has(candidateId)
            return (
              <div key={candidateId}>
                <button
                  type="button"
                  onClick={() => toggleExpanded(candidateId)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {summary?.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={summary.avatarUrl}
                        alt={summary.name}
                        className="size-9 shrink-0 rounded-full object-cover ring-1 ring-gray-200"
                      />
                    ) : (
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {getInitials(summary?.name ?? "?")}
                      </span>
                    )}
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/candidates/${candidateId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-sm font-semibold text-gray-900 hover:text-primary transition-colors truncate"
                      >
                        {summary?.name ?? "Unbekannt"}
                      </Link>
                      <p className="text-[11px] text-gray-400">
                        geb. {formatDate(summary?.geburtsdatum)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="border border-gray-200 bg-gray-50/80 px-1.5 py-[3px] text-[10px] font-semibold text-gray-500">
                      {docs.length} Dokument{docs.length !== 1 ? "e" : ""}
                    </span>
                    <ChevronDown className={`size-4 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {isExpanded && (
                  <div className="divide-y divide-gray-100 bg-gray-50/40 px-5">
                    {docs.map((doc) => (
                      <div key={`${doc.kind}-${doc._id}`} className="flex items-center justify-between gap-3 py-2.5 pl-[3.25rem]">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-gray-400 uppercase border border-gray-200 px-1 py-px leading-none shrink-0">{doc.type}</span>
                            <p className="text-xs text-gray-600 truncate">{doc.name}</p>
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
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="border border-gray-200 bg-white p-5">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FolderOpen className="size-10 text-gray-200 mb-3" />
            <p className="text-sm font-medium text-gray-400">
              {activeFilters.size > 0 ? "Keine Dokumente für diesen Filter" : "Noch keine Dokumente"}
            </p>
            <p className="text-xs text-gray-300 mt-1">Dokumente können im Profil eines Kandidaten hochgeladen werden</p>
          </div>
        </div>
      )}
    </div>
  )
}
