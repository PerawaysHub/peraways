import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl()
  },
})

export const saveDocument = mutation({
  args: {
    candidateId: v.id("candidates"),
    name: v.string(),
    type: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const docId = await ctx.db.insert("documents", {
      candidateId: args.candidateId,
      name: args.name,
      type: args.type,
      storageId: args.storageId,
      uploadedAt: Date.now(),
    })
    await ctx.db.insert("activityLog", {
      candidateId: args.candidateId,
      type: "document_uploaded",
      description: `Document uploaded: ${args.name}`,
      timestamp: Date.now(),
    })
    return docId
  },
})

export const listByCandidate = query({
  args: { candidateId: v.id("candidates") },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("documents")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .order("desc")
      .collect()
    return await Promise.all(
      docs.map(async (doc) => ({
        ...doc,
        url: await ctx.storage.getUrl(doc.storageId),
      }))
    )
  },
})

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("documents").order("desc").collect()
    return await Promise.all(
      docs.map(async (doc) => {
        const candidate = await ctx.db.get(doc.candidateId)
        return {
          ...doc,
          url: await ctx.storage.getUrl(doc.storageId),
          candidateName: candidate?.name ?? "Unknown",
        }
      })
    )
  },
})

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id)
    if (!doc) return
    await ctx.storage.delete(doc.storageId)
    await ctx.db.delete(args.id)
  },
})
