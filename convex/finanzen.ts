import { query, mutation, MutationCtx } from "./_generated/server"
import { v } from "convex/values"
import type { Id } from "./_generated/dataModel"
import { getCurrentUserRole, requireAdmin } from "./permissions"

async function getOrCreateRow(ctx: MutationCtx, candidateId: Id<"candidates">) {
  const row = await ctx.db
    .query("finanzen")
    .withIndex("by_candidate", (q) => q.eq("candidateId", candidateId))
    .first()
  if (row) return row
  const rowId = await ctx.db.insert("finanzen", {
    candidateId,
    honorarbetrag: "8500",
    rabattAngewendet: false,
    status: "Offen",
  })
  const created = await ctx.db.get(rowId)
  if (!created) throw new Error("Failed to create finanzen row")
  return created
}

export const getByCandidateId = query({
  args: { candidateId: v.id("candidates") },
  handler: async (ctx, args) => {
    const role = await getCurrentUserRole(ctx)
    if (role !== "admin") return null

    const row = await ctx.db
      .query("finanzen")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .first()
    if (row) return row

    return {
      _id: undefined,
      candidateId: args.candidateId,
      honorarbetrag: "8500" as const,
      rabattAngewendet: false,
      status: "Offen" as const,
      faelligkeitsdatum: undefined,
      bezahldatum: undefined,
    }
  },
})

export const updateHonorar = mutation({
  args: {
    candidateId: v.id("candidates"),
    honorarbetrag: v.union(v.literal("8500"), v.literal("8000")),
    rabattAngewendet: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const row = await getOrCreateRow(ctx, args.candidateId)
    await ctx.db.patch(row._id, {
      honorarbetrag: args.honorarbetrag,
      rabattAngewendet: args.rabattAngewendet,
    })
    await ctx.db.insert("activityLog", {
      candidateId: args.candidateId,
      type: "finanzen_honorar_change",
      description: `Honorar: ${args.honorarbetrag} € ${args.rabattAngewendet ? "(Neukundenrabatt)" : "(Standard)"}`,
      timestamp: Date.now(),
    })
  },
})

export const setStatus = mutation({
  args: {
    candidateId: v.id("candidates"),
    status: v.union(v.literal("Offen"), v.literal("Fällig"), v.literal("Bezahlt")),
    bezahldatum: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const row = await getOrCreateRow(ctx, args.candidateId)
    await ctx.db.patch(row._id, {
      status: args.status,
      bezahldatum: args.bezahldatum,
    })
    await ctx.db.insert("activityLog", {
      candidateId: args.candidateId,
      type: "finanzen_status_change",
      description: `Honorar-Status → ${args.status}`,
      timestamp: Date.now(),
    })
  },
})

export const getFinanzStats = query({
  args: {},
  handler: async (ctx) => {
    const role = await getCurrentUserRole(ctx)
    if (role !== "admin") return null

    const rows = await ctx.db.query("finanzen").collect()
    let bezahlterUmsatz = 0
    let offeneHonorarforderungen = 0
    let faelligCount = 0
    for (const row of rows) {
      const betrag = Number(row.honorarbetrag)
      if (row.status === "Bezahlt") {
        bezahlterUmsatz += betrag
      } else {
        offeneHonorarforderungen += betrag
        if (row.status === "Fällig") faelligCount++
      }
    }
    return { bezahlterUmsatz, offeneHonorarforderungen, faelligCount }
  },
})

export async function recomputeFaelligkeitsdatum(
  ctx: MutationCtx,
  candidateId: Id<"candidates">,
  ersterArbeitstag: number | undefined
) {
  const faelligkeitsdatum =
    ersterArbeitstag !== undefined
      ? ersterArbeitstag + 30 * 24 * 60 * 60 * 1000
      : undefined
  const row = await getOrCreateRow(ctx, candidateId)
  await ctx.db.patch(row._id, { faelligkeitsdatum })
}
