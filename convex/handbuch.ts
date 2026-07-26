import { query, mutation } from "./_generated/server"
import { v } from "convex/values"
import { getCurrentUserRole, requireAdmin } from "./permissions"

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return await ctx.storage.generateUploadUrl()
  },
})

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    storageId: v.id("_storage"),
    visibleToRoles: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    return await ctx.db.insert("handbuchDocuments", {
      title: args.title,
      description: args.description,
      storageId: args.storageId,
      uploadedAt: Date.now(),
      visibleToRoles: args.visibleToRoles,
    })
  },
})

export const updateVisibility = mutation({
  args: {
    id: v.id("handbuchDocuments"),
    visibleToRoles: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    await ctx.db.patch(args.id, { visibleToRoles: args.visibleToRoles })
  },
})

export const remove = mutation({
  args: { id: v.id("handbuchDocuments") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const doc = await ctx.db.get(args.id)
    if (!doc) return
    await ctx.storage.delete(doc.storageId)
    await ctx.db.delete(args.id)
  },
})

export const listForCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const role = await getCurrentUserRole(ctx)
    if (!role) return []
    const all = await ctx.db.query("handbuchDocuments").order("desc").collect()
    const visible = all.filter((doc) => doc.visibleToRoles.includes(role))
    return await Promise.all(
      visible.map(async (doc) => ({
        ...doc,
        url: await ctx.storage.getUrl(doc.storageId),
      }))
    )
  },
})

export const listAllForAdmin = query({
  args: {},
  handler: async (ctx) => {
    const role = await getCurrentUserRole(ctx)
    if (role !== "admin") return []
    const all = await ctx.db.query("handbuchDocuments").order("desc").collect()
    return await Promise.all(
      all.map(async (doc) => ({
        ...doc,
        url: await ctx.storage.getUrl(doc.storageId),
      }))
    )
  },
})
