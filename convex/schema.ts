import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const CANDIDATE_STATUSES = [
  "Neue Bewerbung",
  "Kontaktiert",
  "Gespräch",
  "Angebot",
  "Visum",
  "Gestartet",
] as const;

export default defineSchema({
  contacts: defineTable({
    name: v.string(),
    email: v.string(),
    telefon: v.optional(v.string()),
    nachricht: v.string(),
    lang: v.string(),
  }),
  candidates: defineTable({
    name: v.string(),
    email: v.string(),
    telefon: v.optional(v.string()),
    status: v.string(),
    position: v.number(),
    notes: v.string(),
    source: v.string(),
    lang: v.string(),
  }).index("by_status", ["status", "position"]),
  documents: defineTable({
    candidateId: v.id("candidates"),
    name: v.string(),
    type: v.string(),
    storageId: v.id("_storage"),
    uploadedAt: v.number(),
  }).index("by_candidate", ["candidateId"]),
  activityLog: defineTable({
    candidateId: v.id("candidates"),
    type: v.string(),
    description: v.string(),
    timestamp: v.number(),
  }).index("by_candidate", ["candidateId"]),
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("viewer"), v.literal("editor")),
  }).index("by_clerkId", ["clerkId"]),
});
