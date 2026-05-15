import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    telefon: v.optional(v.string()),
    nachricht: v.string(),
    lang: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contacts", {
      name: args.name,
      email: args.email,
      telefon: args.telefon ?? "",
      nachricht: args.nachricht,
      lang: args.lang,
    });
  },
});
