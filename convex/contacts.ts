import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
