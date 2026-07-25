import { query, mutation, MutationCtx } from "./_generated/server"
import { v } from "convex/values"
import { COMPLIANCE_DOC_TYPES, COMPLIANCE_DOC_LABELS } from "./schema"
import type { Id } from "./_generated/dataModel"

export const getComplianceStatus = query({
  args: { candidateId: v.id("candidates") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("complianceDocuments")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .collect()
    const byType = new Map(rows.map((r) => [r.docType, r]))

    const items = await Promise.all(
      COMPLIANCE_DOC_TYPES.map(async (docType) => {
        const row = byType.get(docType)
        return {
          docType,
          label: COMPLIANCE_DOC_LABELS[docType] ?? docType,
          status: row?.status ?? "Fehlt",
          storageId: row?.storageId,
          uploadedAt: row?.uploadedAt,
          url: row?.storageId ? await ctx.storage.getUrl(row.storageId) : null,
          rowId: row?._id,
        }
      })
    )

    const receivedCount = items.filter((i) => i.status === "Erhalten").length
    return {
      items,
      receivedCount,
      totalCount: COMPLIANCE_DOC_TYPES.length,
      allReceived: receivedCount === COMPLIANCE_DOC_TYPES.length,
    }
  },
})

async function getOrCreateRow(
  ctx: MutationCtx,
  candidateId: Id<"candidates">,
  docType: string
) {
  const row = await ctx.db
    .query("complianceDocuments")
    .withIndex("by_candidate_and_type", (q) =>
      q.eq("candidateId", candidateId).eq("docType", docType)
    )
    .first()
  if (row) return row
  const rowId = await ctx.db.insert("complianceDocuments", {
    candidateId,
    docType,
    status: "Fehlt",
  })
  const created = await ctx.db.get(rowId)
  if (!created) throw new Error("Failed to create compliance document row")
  return created
}

export const setComplianceStatus = mutation({
  args: {
    candidateId: v.id("candidates"),
    docType: v.string(),
    status: v.union(v.literal("Erhalten"), v.literal("Fehlt")),
  },
  handler: async (ctx, args) => {
    const row = await getOrCreateRow(ctx, args.candidateId, args.docType)
    await ctx.db.patch(row._id, { status: args.status })
    await ctx.db.insert("activityLog", {
      candidateId: args.candidateId,
      type: "compliance_status_change",
      description: `Compliance: ${COMPLIANCE_DOC_LABELS[args.docType] ?? args.docType} → ${args.status}`,
      timestamp: Date.now(),
    })
  },
})

export const attachDocument = mutation({
  args: {
    candidateId: v.id("candidates"),
    docType: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const row = await getOrCreateRow(ctx, args.candidateId, args.docType)
    await ctx.db.patch(row._id, {
      storageId: args.storageId,
      uploadedAt: Date.now(),
      status: "Erhalten",
    })
    await ctx.db.insert("activityLog", {
      candidateId: args.candidateId,
      type: "compliance_document_uploaded",
      description: `Datei hochgeladen: ${COMPLIANCE_DOC_LABELS[args.docType] ?? args.docType}`,
      timestamp: Date.now(),
    })
  },
})

export const removeDocument = mutation({
  args: {
    candidateId: v.id("candidates"),
    docType: v.string(),
  },
  handler: async (ctx, args) => {
    const row = await getOrCreateRow(ctx, args.candidateId, args.docType)
    if (row.storageId) {
      await ctx.storage.delete(row.storageId)
      await ctx.db.patch(row._id, { storageId: undefined, uploadedAt: undefined })
    }
  },
})
