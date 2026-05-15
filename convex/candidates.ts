import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("candidates").order("desc").collect();
  },
});

export const getByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("candidates")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("asc")
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("candidates") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    telefon: v.optional(v.string()),
    source: v.string(),
    lang: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("candidates")
      .withIndex("by_status", (q) => q.eq("status", "Neue Bewerbung"))
      .order("desc")
      .first();
    const maxPosition = existing ? (await ctx.db.get(existing._id))?.position ?? 0 : 0;
    return await ctx.db.insert("candidates", {
      name: args.name,
      email: args.email,
      telefon: args.telefon ?? "",
      status: "Neue Bewerbung",
      position: maxPosition + 1,
      notes: "",
      source: args.source,
      lang: args.lang,
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("candidates"),
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
        id: v.id("candidates"),
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

export const updateNotes = mutation({
  args: {
    id: v.id("candidates"),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { notes: args.notes });
  },
});

export const remove = mutation({
  args: { id: v.id("candidates") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
