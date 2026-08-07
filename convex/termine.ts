import { query, mutation, QueryCtx } from "./_generated/server"
import { v } from "convex/values"
import type { Id, Doc } from "./_generated/dataModel"
import { getCurrentUserRole } from "./permissions"

const ART = v.union(
  v.literal("LEA"),
  v.literal("Bankeröffnung"),
  v.literal("Bürgeramt"),
  v.literal("Rückruf"),
  v.literal("Treffen"),
  v.literal("Sonstiges")
)

const VISIBILITY = v.union(v.literal("alle"), v.literal("nur_ich"))

async function relatedInfo(
  ctx: QueryCtx,
  candidateId?: Id<"candidates">,
  contactId?: Id<"contacts">
) {
  if (candidateId) {
    const candidate = await ctx.db.get(candidateId)
    return {
      candidateName: candidate?.name ?? "Unbekannt",
      relatedName: candidate?.name ?? "Unbekannt",
      relatedHref: `/dashboard/candidates/${candidateId}#termine-section`,
    }
  }
  if (contactId) {
    const contact = await ctx.db.get(contactId)
    const name = contact?.einrichtung || contact?.name || "Unbekannt"
    return {
      candidateName: "",
      relatedName: name,
      relatedHref: `/dashboard/contacts/${contactId}#termine-section`,
    }
  }
  return { candidateName: "Unbekannt", relatedName: "Unbekannt", relatedHref: "" }
}

async function getCurrentUserId(ctx: QueryCtx): Promise<Id<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) return null
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
    .unique()
  return user?._id ?? null
}

async function filterVisible<T extends Pick<Doc<"termine">, "visibility" | "createdBy">>(
  ctx: QueryCtx,
  rows: T[]
): Promise<T[]> {
  const currentUserId = await getCurrentUserId(ctx)
  return rows.filter(
    (row) => (row.visibility ?? "alle") === "alle" || row.createdBy === currentUserId
  )
}

export const create = mutation({
  args: {
    candidateId: v.optional(v.id("candidates")),
    contactId: v.optional(v.id("contacts")),
    datum: v.number(),
    uhrzeit: v.string(),
    art: ART,
    notizen: v.optional(v.string()),
    visibility: v.optional(VISIBILITY),
  },
  handler: async (ctx, args) => {
    if (!args.candidateId === !args.contactId) {
      throw new Error("Genau eines von candidateId/contactId muss gesetzt sein")
    }
    const role = await getCurrentUserRole(ctx)
    const visibility = args.visibility === "nur_ich" && role === "admin" ? "nur_ich" : "alle"
    const currentUserId = await getCurrentUserId(ctx)
    const terminId = await ctx.db.insert("termine", {
      candidateId: args.candidateId,
      contactId: args.contactId,
      datum: args.datum,
      uhrzeit: args.uhrzeit,
      art: args.art,
      notizen: args.notizen,
      status: "Offen",
      visibility,
      createdBy: currentUserId ?? undefined,
    })
    if (args.candidateId) {
      await ctx.db.insert("activityLog", {
        candidateId: args.candidateId,
        type: "termin_created",
        description: `Termin angelegt: ${args.art} am ${new Date(args.datum).toLocaleDateString("de-DE")}`,
        timestamp: Date.now(),
      })
    }
    return terminId
  },
})

export const listByCandidate = query({
  args: { candidateId: v.id("candidates") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("termine")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .collect()
    return await filterVisible(ctx, rows)
  },
})

export const listByContact = query({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("termine")
      .withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
      .collect()
    return await filterVisible(ctx, rows)
  },
})

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("termine").collect()
    const visible = await filterVisible(ctx, rows)
    const withNames = await Promise.all(
      visible.map(async (row) => ({ ...row, ...(await relatedInfo(ctx, row.candidateId, row.contactId)) }))
    )
    return withNames.sort((a, b) => a.datum - b.datum)
  },
})

export const listToday = query({
  args: { startOfDay: v.number(), endOfDay: v.number() },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("termine")
      .withIndex("by_datum", (q) => q.gte("datum", args.startOfDay).lt("datum", args.endOfDay))
      .collect()
    const visible = await filterVisible(ctx, rows)
    const withNames = await Promise.all(
      visible.map(async (row) => ({ ...row, ...(await relatedInfo(ctx, row.candidateId, row.contactId)) }))
    )
    return withNames.sort((a, b) => a.uhrzeit.localeCompare(b.uhrzeit))
  },
})

export const listOpenBefore = query({
  args: { before: v.number() },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("termine")
      .withIndex("by_datum", (q) => q.lt("datum", args.before))
      .filter((q) => q.eq(q.field("status"), "Offen"))
      .collect()
    const visible = await filterVisible(ctx, rows)
    const withNames = await Promise.all(
      visible.map(async (row) => ({ ...row, ...(await relatedInfo(ctx, row.candidateId, row.contactId)) }))
    )
    return withNames.sort((a, b) => a.datum - b.datum)
  },
})

export const update = mutation({
  args: {
    id: v.id("termine"),
    datum: v.optional(v.number()),
    uhrzeit: v.optional(v.string()),
    art: v.optional(ART),
    notizen: v.optional(v.string()),
    visibility: v.optional(VISIBILITY),
  },
  handler: async (ctx, args) => {
    const { id, visibility, ...fields } = args
    if (visibility === undefined) {
      await ctx.db.patch(id, fields)
      return
    }
    const role = await getCurrentUserRole(ctx)
    if (role !== "admin") throw new Error("Not authorized")
    const termin = await ctx.db.get(id)
    // "nur ich" always means only the admin flipping the switch right now.
    const currentUserId = await getCurrentUserId(ctx)
    await ctx.db.patch(id, {
      ...fields,
      visibility,
      createdBy: visibility === "nur_ich" ? currentUserId ?? undefined : termin?.createdBy,
    })
  },
})

export const updateStatus = mutation({
  args: {
    id: v.id("termine"),
    status: v.union(v.literal("Offen"), v.literal("Erledigt")),
  },
  handler: async (ctx, args) => {
    const termin = await ctx.db.get(args.id)
    if (!termin) return
    await ctx.db.patch(args.id, { status: args.status })
    if (termin.candidateId) {
      await ctx.db.insert("activityLog", {
        candidateId: termin.candidateId,
        type: "termin_status_change",
        description: `Termin (${termin.art}) → ${args.status}`,
        timestamp: Date.now(),
      })
    }
  },
})

export const remove = mutation({
  args: { id: v.id("termine") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id)
  },
})
