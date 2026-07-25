import { mutation } from "./_generated/server"
import { v } from "convex/values"
import { internal } from "./_generated/api"

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    telefon: v.optional(v.string()),
    einrichtung: v.optional(v.string()),
    nachricht: v.string(),
    lang: v.string(),
  },
  handler: async (ctx, args) => {
    const recent = await ctx.db
      .query("contacts")
      .order("desc")
      .take(30);

    const window = 5 * 60 * 1000;
    const now = Date.now();

    const sameEmail = recent.find(
      (c) => c.email === args.email && c._creationTime > now - window
    );
    if (sameEmail) {
      throw new Error("Please wait 5 minutes between submissions.");
    }

    const globalCount = recent.filter(
      (c) => c._creationTime > now - 60_000
    ).length;
    if (globalCount >= 10) {
      throw new Error("Too many submissions. Try again later.");
    }

    const existing = await ctx.db
      .query("contacts")
      .withIndex("by_status", (q) => q.eq("status", "Neue Anfrage"))
      .order("desc")
      .first();
    const maxPosition = existing ? (existing.position ?? 0) : 0;

    const contactId = await ctx.db.insert("contacts", {
      name: args.name,
      email: args.email,
      telefon: args.telefon ?? "",
      einrichtung: args.einrichtung ?? "",
      nachricht: args.nachricht,
      lang: args.lang,
      status: "Neue Anfrage",
      position: maxPosition + 1,
    })

    await ctx.db.insert("notifications", {
      type: "new_contact",
      title: args.lang === "de" ? "Neue Kontaktanfrage" : "New contact inquiry",
      description: args.lang === "de"
        ? `Von ${args.name} (${args.email})`
        : `From ${args.name} (${args.email})`,
      read: false,
      relatedId: contactId,
    })

    await ctx.scheduler.runAfter(0, internal.sendEmails.sendContactEmails, {
      name: args.name,
      email: args.email,
      telefon: args.telefon,
      einrichtung: args.einrichtung,
      nachricht: args.nachricht,
      lang: args.lang,
    })
  },
})
