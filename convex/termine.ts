import { query, mutation, QueryCtx } from "./_generated/server"
import { v } from "convex/values"
import type { Id } from "./_generated/dataModel"

const ART = v.union(
  v.literal("LEA"),
  v.literal("Bankeröffnung"),
  v.literal("Bürgeramt"),
  v.literal("Rückruf"),
  v.literal("Treffen"),
  v.literal("Sonstiges")
)

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

export const create = mutation({
  args: {
    candidateId: v.optional(v.id("candidates")),
    contactId: v.optional(v.id("contacts")),
    datum: v.number(),
    uhrzeit: v.string(),
    art: ART,
    notizen: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!args.candidateId === !args.contactId) {
      throw new Error("Genau eines von candidateId/contactId muss gesetzt sein")
    }
    const terminId = await ctx.db.insert("termine", {
      candidateId: args.candidateId,
      contactId: args.contactId,
      datum: args.datum,
      uhrzeit: args.uhrzeit,
      art: args.art,
      notizen: args.notizen,
      status: "Offen",
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
    return await ctx.db
      .query("termine")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .collect()
  },
})

export const listByContact = query({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("termine")
      .withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
      .collect()
  },
})

export const listToday = query({
  args: { startOfDay: v.number(), endOfDay: v.number() },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("termine")
      .withIndex("by_datum", (q) => q.gte("datum", args.startOfDay).lt("datum", args.endOfDay))
      .collect()
    const withNames = await Promise.all(
      rows.map(async (row) => ({ ...row, ...(await relatedInfo(ctx, row.candidateId, row.contactId)) }))
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
    const withNames = await Promise.all(
      rows.map(async (row) => ({ ...row, ...(await relatedInfo(ctx, row.candidateId, row.contactId)) }))
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
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args
    await ctx.db.patch(id, fields)
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
