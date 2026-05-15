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
    const maxPosition = existing ? (existing.position ?? 0) : 0;
    const candidateId = await ctx.db.insert("candidates", {
      name: args.name,
      email: args.email,
      telefon: args.telefon ?? "",
      status: "Neue Bewerbung",
      position: maxPosition + 1,
      notes: "",
      source: args.source,
      lang: args.lang,
    });
    await ctx.db.insert("activityLog", {
      candidateId,
      type: "created",
      description: "Candidate created",
      timestamp: Date.now(),
    });
    return candidateId;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("candidates"),
    status: v.string(),
    position: v.number(),
  },
  handler: async (ctx, args) => {
    const candidate = await ctx.db.get(args.id);
    if (!candidate) return;
    const oldStatus = candidate.status;
    if (oldStatus !== args.status) {
      await ctx.db.insert("activityLog", {
        candidateId: args.id,
        type: "status_change",
        description: `Status changed: ${oldStatus} → ${args.status}`,
        timestamp: Date.now(),
      });
    }
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
    const candidate = await ctx.db.get(args.id);
    if (!candidate) return;
    await ctx.db.patch(args.id, { notes: args.notes });
    if (args.notes && args.notes !== (candidate.notes ?? "")) {
      await ctx.db.insert("activityLog", {
        candidateId: args.id,
        type: "note_added",
        description: "Notes updated",
        timestamp: Date.now(),
      });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("candidates") },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("documents")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.id))
      .collect();
    for (const doc of docs) {
      await ctx.storage.delete(doc.storageId);
      await ctx.db.delete(doc._id);
    }
    const logs = await ctx.db
      .query("activityLog")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.id))
      .collect();
    for (const log of logs) {
      await ctx.db.delete(log._id);
    }
    await ctx.db.delete(args.id);
  },
});
