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
});
