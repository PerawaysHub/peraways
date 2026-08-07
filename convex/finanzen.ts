import { query, mutation, internalMutation, internalQuery, MutationCtx, QueryCtx } from "./_generated/server"
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

// Trashed (soft-deleted) Talente must never surface in Finanzen aggregates —
// their finanzen row survives the soft delete untouched (only permanentlyDelete
// removes it), so every cross-candidate read has to join back and exclude them.
async function getActiveCandidatesById(ctx: QueryCtx | MutationCtx) {
  const candidates = await ctx.db.query("candidates").collect()
  return new Map(candidates.filter((c) => !c.deletedAt).map((c) => [c._id, c]))
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

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const role = await getCurrentUserRole(ctx)
    if (role !== "admin") return null

    const [rows, activeCandidatesById, contacts] = await Promise.all([
      ctx.db.query("finanzen").collect(),
      getActiveCandidatesById(ctx),
      ctx.db.query("contacts").collect(),
    ])
    const contactsById = new Map(contacts.map((c) => [c._id, c]))

    return rows
      .filter((r) => activeCandidatesById.has(r.candidateId))
      .map((r) => {
        const candidate = activeCandidatesById.get(r.candidateId)!
        const einrichtung = candidate.einrichtungId ? contactsById.get(candidate.einrichtungId) : undefined
        return {
          _id: r._id,
          candidateId: r.candidateId,
          candidateName: candidate.name,
          einrichtungId: candidate.einrichtungId ?? null,
          einrichtungName: einrichtung ? einrichtung.einrichtung || einrichtung.name : null,
          honorarbetrag: r.honorarbetrag,
          rabattAngewendet: r.rabattAngewendet,
          status: r.status,
          faelligkeitsdatum: r.faelligkeitsdatum,
          bezahldatum: r.bezahldatum,
        }
      })
      .sort((a, b) => a.candidateName.localeCompare(b.candidateName))
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

    const [rows, activeCandidatesById] = await Promise.all([
      ctx.db.query("finanzen").collect(),
      getActiveCandidatesById(ctx),
    ])
    let bezahlterUmsatz = 0
    let offeneHonorarforderungen = 0
    let faelligCount = 0
    for (const row of rows) {
      if (!activeCandidatesById.has(row.candidateId)) continue
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

// Cron-triggered — no logged-in user, so this bypasses setStatus/requireAdmin
// and patches directly. See convex/crons.ts.
export const checkFaelligkeit = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now()
    const activeCandidatesById = await getActiveCandidatesById(ctx)
    const rows = await ctx.db.query("finanzen").collect()
    const due = rows.filter(
      (r) =>
        r.status === "Offen" &&
        r.faelligkeitsdatum !== undefined &&
        r.faelligkeitsdatum <= now &&
        activeCandidatesById.has(r.candidateId)
    )
    for (const row of due) {
      await ctx.db.patch(row._id, { status: "Fällig" })
      const candidate = activeCandidatesById.get(row.candidateId)!
      await ctx.db.insert("activityLog", {
        candidateId: row.candidateId,
        type: "finanzen_status_change",
        description: "Honorar-Status → Fällig",
        timestamp: now,
      })
      await ctx.db.insert("notifications", {
        type: "finanzen_faellig",
        title: "Honorar fällig",
        description: `${candidate.name}: Honorar (${row.honorarbetrag} €) ist jetzt fällig.`,
        read: false,
        relatedId: row.candidateId,
      })
    }
  },
})

// Fires on day 7, 14, 21, ... of being "Fällig", computed purely from
// faelligkeitsdatum vs. now — no stored "last reminded" state needed, and no
// double-send risk if a cron run is ever skipped (that day's bucket just
// doesn't fire, next reminder is the following multiple of 7).
export const listOverdueForReminder = internalQuery({
  args: {},
  handler: async (ctx) => {
    const now = Date.now()
    const msPerDay = 24 * 60 * 60 * 1000
    const activeCandidatesById = await getActiveCandidatesById(ctx)
    const rows = await ctx.db.query("finanzen").collect()
    const result: { candidateId: Id<"candidates">; candidateName: string; honorarbetrag: string; daysOverdue: number }[] = []
    for (const row of rows) {
      if (row.status !== "Fällig" || row.faelligkeitsdatum === undefined) continue
      const candidate = activeCandidatesById.get(row.candidateId)
      if (!candidate) continue
      const daysOverdue = Math.floor((now - row.faelligkeitsdatum) / msPerDay)
      if (daysOverdue < 7 || (daysOverdue - 7) % 7 !== 0) continue
      result.push({
        candidateId: row.candidateId,
        candidateName: candidate.name,
        honorarbetrag: row.honorarbetrag,
        daysOverdue,
      })
    }
    return result
  },
})
