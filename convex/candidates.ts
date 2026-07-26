import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { CANDIDATE_STATUSES, COMPLIANCE_DOC_TYPES } from "./schema";
import { recomputeFaelligkeitsdatum } from "./finanzen";
import { getCurrentUserRole } from "./permissions";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("candidates").order("desc").collect();
    return all.filter((c) => !c.deletedAt);
  },
});

export const listDeleted = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("candidates").order("desc").collect();
    return all.filter((c) => !!c.deletedAt);
  },
});

export const getByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db
      .query("candidates")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("asc")
      .collect();
    return all.filter((c) => !c.deletedAt);
  },
});

export const getById = query({
  args: { id: v.id("candidates") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listByEinrichtung = query({
  args: { einrichtungId: v.id("contacts") },
  handler: async (ctx, args) => {
    const all = await ctx.db
      .query("candidates")
      .withIndex("by_einrichtung", (q) => q.eq("einrichtungId", args.einrichtungId))
      .collect();
    return all.filter((c) => !c.deletedAt);
  },
});

export const setEinrichtung = mutation({
  args: {
    id: v.id("candidates"),
    einrichtungId: v.optional(v.id("contacts")),
  },
  handler: async (ctx, args) => {
    const candidate = await ctx.db.get(args.id);
    if (!candidate) return;
    const einrichtung = args.einrichtungId ? await ctx.db.get(args.einrichtungId) : null;
    await ctx.db.patch(args.id, { einrichtungId: args.einrichtungId });
    await ctx.db.insert("activityLog", {
      candidateId: args.id,
      type: "einrichtung_change",
      description: einrichtung
        ? `Einrichtung zugeordnet: ${einrichtung.einrichtung || einrichtung.name}`
        : "Einrichtungs-Zuordnung entfernt",
      timestamp: Date.now(),
    });
  },
});

export const listSummaries = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("candidates").collect();
    return await Promise.all(
      all.map(async (c) => ({
        _id: c._id,
        name: c.name,
        geburtsdatum: c.geburtsdatum,
        avatarUrl: c.avatarStorageId ? await ctx.storage.getUrl(c.avatarStorageId) : null,
      }))
    );
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
    lang: v.string(),
    geburtsdatum: v.optional(v.number()),
    passnummer: v.optional(v.string()),
    herkunftsland: v.optional(v.string()),
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
      lang: args.lang,
      geburtsdatum: args.geburtsdatum,
      passnummer: args.passnummer,
      herkunftsland: args.herkunftsland,
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
    await ctx.db.insert("finanzen", {
      candidateId,
      honorarbetrag: "8500",
      rabattAngewendet: false,
      status: "Offen",
    });
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
    if (args.ersterArbeitstag !== undefined) {
      await recomputeFaelligkeitsdatum(ctx, id, args.ersterArbeitstag);
    }
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
    const role = await getCurrentUserRole(ctx);
    if (role === "gstc") throw new Error("Not authorized");
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
    const role = await getCurrentUserRole(ctx);
    if (role === "gstc") throw new Error("Not authorized");
    await ctx.db.patch(args.id, { deletedAt: Date.now() });
  },
});

export const restore = mutation({
  args: { id: v.id("candidates") },
  handler: async (ctx, args) => {
    const role = await getCurrentUserRole(ctx);
    if (role === "gstc") throw new Error("Not authorized");
    await ctx.db.patch(args.id, { deletedAt: undefined });
  },
});

export const permanentlyDelete = mutation({
  args: { id: v.id("candidates") },
  handler: async (ctx, args) => {
    const role = await getCurrentUserRole(ctx);
    if (role === "gstc") throw new Error("Not authorized");
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
    const complianceDocs = await ctx.db
      .query("complianceDocuments")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.id))
      .collect();
    for (const doc of complianceDocs) {
      if (doc.storageId) {
        await ctx.storage.delete(doc.storageId);
      }
      await ctx.db.delete(doc._id);
    }
    const terminRows = await ctx.db
      .query("termine")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.id))
      .collect();
    for (const t of terminRows) {
      await ctx.db.delete(t._id);
    }
    const finanzenRow = await ctx.db
      .query("finanzen")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.id))
      .first();
    if (finanzenRow) {
      await ctx.db.delete(finanzenRow._id);
    }
    await ctx.db.delete(args.id);
  },
});
