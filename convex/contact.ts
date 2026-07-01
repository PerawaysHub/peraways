import { mutation } from "./_generated/server"
import { v } from "convex/values"
import { Resend } from "resend"
import { autoResponse, teamNotification } from "./emails"

const resend = new Resend(process.env.RESEND_API_KEY!)

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    telefon: v.optional(v.string()),
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

    const contactId = await ctx.db.insert("contacts", {
      name: args.name,
      email: args.email,
      telefon: args.telefon ?? "",
      nachricht: args.nachricht,
      lang: args.lang,
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

    const { subject: notifSubject, html: notifHtml } = teamNotification(args)
    await resend.emails.send({
      from: "PeraWays <kontakt@peraways.de>",
      to: ["kontakt@peraways.de"],
      subject: notifSubject,
      html: notifHtml,
    })

    const { subject: replySubject, html: replyHtml } = autoResponse(args.name, args.lang)
    await resend.emails.send({
      from: "PeraWays <kontakt@peraways.de>",
      to: [args.email],
      subject: replySubject,
      html: replyHtml,
    })
  },
})
