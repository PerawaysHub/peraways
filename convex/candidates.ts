import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { CANDIDATE_STATUSES, COMPLIANCE_DOC_TYPES } from "./schema";

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

export const getAvatarUrl = query({
  args: { candidateId: v.id("candidates") },
  handler: async (ctx, args) => {
    const candidate = await ctx.db.get(args.candidateId);
    if (!candidate?.avatarStorageId) return null;
    return await ctx.storage.getUrl(candidate.avatarStorageId);
  },
});

export const setAvatar = mutation({
  args: {
    id: v.id("candidates"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const candidate = await ctx.db.get(args.id);
    if (!candidate) return;
    if (candidate.avatarStorageId) {
      await ctx.storage.delete(candidate.avatarStorageId);
    }
    await ctx.db.patch(args.id, { avatarStorageId: args.storageId });
  },
});

export const removeAvatar = mutation({
  args: { id: v.id("candidates") },
  handler: async (ctx, args) => {
    const candidate = await ctx.db.get(args.id);
    if (!candidate?.avatarStorageId) return;
    await ctx.storage.delete(candidate.avatarStorageId);
    await ctx.db.patch(args.id, { avatarStorageId: undefined });
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
    const initialStatus = CANDIDATE_STATUSES[0];
    const existing = await ctx.db
      .query("candidates")
      .withIndex("by_status", (q) => q.eq("status", initialStatus))
      .order("desc")
      .first();
    const maxPosition = existing ? (existing.position ?? 0) : 0;
    const candidateId = await ctx.db.insert("candidates", {
      name: args.name,
      email: args.email,
      telefon: args.telefon ?? "",
      status: initialStatus,
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
    for (const docType of COMPLIANCE_DOC_TYPES) {
      await ctx.db.insert("complianceDocuments", {
        candidateId,
        docType,
        status: "Fehlt",
      });
    }
    return candidateId;
  },
});

export const updateDetails = mutation({
  args: {
    id: v.id("candidates"),
    geburtsdatum: v.optional(v.number()),
    passnummer: v.optional(v.string()),
    herkunftsland: v.optional(v.string()),
    b1Status: v.optional(
      v.union(
        v.literal("In Ausbildung"),
        v.literal("Bestanden"),
        v.literal("Nicht gestartet")
      )
    ),
    datumB1Pruefung: v.optional(v.number()),
    aktuellerSprachkurs: v.optional(v.string()),
    flugdatum: v.optional(v.number()),
    landungsdatumBerlin: v.optional(v.number()),
    ablaufdatumVisum: v.optional(v.number()),
    ersterArbeitstag: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const candidate = await ctx.db.get(id);
    if (!candidate) return;
    await ctx.db.patch(id, fields);
    await ctx.db.insert("activityLog", {
      candidateId: id,
      type: "details_updated",
      description: "Talent-Profildaten aktualisiert",
      timestamp: Date.now(),
    });
  },
});

// One-time migration: remaps candidates from the old 6-stage pipeline
// (Neue Bewerbung/Kontaktiert/Gespräch/Angebot/Visum/Gestartet) to the new
// 5-stage Talente pipeline, and renumbers positions within each merged
// column to avoid collisions. Run manually via the Convex dashboard
// function-runner — not wired into deploy. Safe to re-run (idempotent).
export const migrateStatuses = mutation({
  args: {},
  handler: async (ctx) => {
    const mapping: Record<string, string> = {
      "Neue Bewerbung": "Qualifizierung",
      Kontaktiert: "Qualifizierung",
      Gespräch: "Qualifizierung",
      Angebot: "Qualifizierung",
      Visum: "Visum",
      Gestartet: "Onboarding / Berlin-Phase",
    };
    const all = await ctx.db.query("candidates").order("asc").collect();
    const byNewStatus = new Map<string, typeof all>();
    for (const c of all) {
      const newStatus = mapping[c.status] ?? c.status;
      if (!byNewStatus.has(newStatus)) byNewStatus.set(newStatus, []);
      byNewStatus.get(newStatus)!.push(c);
    }
    let migrated = 0;
    for (const group of byNewStatus.values()) {
      group.sort((a, b) => a.position - b.position);
      let pos = 1;
      for (const c of group) {
        const newStatus = mapping[c.status] ?? c.status;
        if (c.status !== newStatus || c.position !== pos) {
          await ctx.db.patch(c._id, { status: newStatus, position: pos });
          migrated++;
        }
        pos++;
      }
    }
    return { migrated };
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
    const candidate = await ctx.db.get(args.id);
    if (candidate?.avatarStorageId) {
      await ctx.storage.delete(candidate.avatarStorageId);
    }
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
