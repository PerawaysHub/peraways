import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  contacts: defineTable({
    name: v.string(),
    email: v.string(),
    telefon: v.optional(v.string()),
    nachricht: v.string(),
    lang: v.string(),
  }),
});
