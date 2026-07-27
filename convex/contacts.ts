import { query, mutation, MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

// Keeps an Einrichtung's pipeline status in sync with its linked Talente:
// - No active (non-deleted) Talent linked -> drop back to "Gespräch" (only
//   if it was further along, i.e. "Vertrag"/"Abgeschlossen" — an Einrichtung
//   that's still early in its own pipeline is left alone).
// - Every linked Talent is "Abgeschlossen" -> promote to "Abgeschlossen".
// - Not every linked Talent is "Abgeschlossen" but the Einrichtung is
//   currently marked "Abgeschlossen" (e.g. a new Talent got assigned after
//   the fact) -> drop back to "Vertrag" so it reads as in-progress again.
// Always overridable afterwards — this only runs as a side effect of a
// Talent-side change, it doesn't re-assert itself on every read.
export async function recomputeStatusFromCandidates(ctx: MutationCtx, einrichtungId: Id<"contacts">) {
  const contact = await ctx.db.get(einrichtungId);
  if (!contact || contact.deletedAt) return;

  const linked = await ctx.db
    .query("candidates")
    .withIndex("by_einrichtung", (q) => q.eq("einrichtungId", einrichtungId))
    .collect();
  const active = linked.filter((c) => !c.deletedAt);

  if (active.length === 0) {
    if (contact.status === "Vertrag" || contact.status === "Abgeschlossen") {
      await ctx.db.patch(einrichtungId, { status: "Gespräch" });
    }
    return;
  }

  const allPlaced = active.every((c) => c.status === "Abgeschlossen");
  if (allPlaced && contact.status !== "Abgeschlossen") {
    await ctx.db.patch(einrichtungId, { status: "Abgeschlossen" });
  } else if (!allPlaced && contact.status === "Abgeschlossen") {
    await ctx.db.patch(einrichtungId, { status: "Vertrag" });
  }
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("contacts").order("desc").collect();
    return all.filter((c) => !c.deletedAt);
  },
});

export const listDeleted = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("contacts").order("desc").collect();
    return all.filter((c) => !!c.deletedAt);
  },
});

export const getById = query({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    telefon: v.optional(v.string()),
    einrichtung: v.optional(v.string()),
    ansprechpartnerName: v.optional(v.string()),
    ansprechpartnerEmail: v.optional(v.string()),
    ansprechpartnerTelefon: v.optional(v.string()),
    rahmenvertragUnterschrieben: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("contacts")
      .withIndex("by_status", (q) => q.eq("status", "Neue Anfrage"))
      .order("desc")
      .first();
    const maxPosition = existing ? (existing.position ?? 0) : 0;
    return await ctx.db.insert("contacts", {
      name: args.name,
      email: args.email,
      telefon: args.telefon ?? "",
      einrichtung: args.einrichtung ?? "",
      nachricht: "",
      lang: "de",
      status: "Neue Anfrage",
      position: maxPosition + 1,
      ansprechpartnerName: args.ansprechpartnerName ?? "",
      ansprechpartnerEmail: args.ansprechpartnerEmail ?? "",
      ansprechpartnerTelefon: args.ansprechpartnerTelefon ?? "",
      rahmenvertragUnterschrieben: args.rahmenvertragUnterschrieben ?? false,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("contacts"),
    name: v.string(),
    email: v.string(),
    telefon: v.optional(v.string()),
    einrichtung: v.optional(v.string()),
    nachricht: v.string(),
    lang: v.string(),
    ansprechpartnerName: v.optional(v.string()),
    ansprechpartnerEmail: v.optional(v.string()),
    ansprechpartnerTelefon: v.optional(v.string()),
    rahmenvertragUnterschrieben: v.optional(v.boolean()),
    adresse: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("contacts"),
    status: v.string(),
    position: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      position: args.position,
    });
  },
});

export const updatePositions = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("contacts"),
        status: v.string(),
        position: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const update of args.updates) {
      await ctx.db.patch(update.id, {
        status: update.status,
        position: update.position,
      });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { deletedAt: Date.now() });
  },
});

export const restore = mutation({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { deletedAt: undefined });
  },
});

export const permanentlyDelete = mutation({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// One-time migration: backfill status/position on contacts created before
// the pipeline existed. Safe to re-run - skips contacts that already have
// a status.
export const migrateStatuses = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("contacts").order("asc").collect();
    let position = 0;
    let migrated = 0;
    for (const contact of all) {
      if (contact.status) continue;
      position += 1;
      await ctx.db.patch(contact._id, {
        status: "Neue Anfrage",
        position,
      });
      migrated += 1;
    }
    return { migrated };
  },
});
