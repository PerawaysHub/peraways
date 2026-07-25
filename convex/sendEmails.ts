"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";
import { autoResponse, teamNotification } from "./emails";

const resend = new Resend(process.env.RESEND_API_KEY!);

// Mutations run in a runtime with no outbound network access, so the actual
// email sending has to happen in a Node action instead - convex/contact.ts
// schedules this right after it inserts the contact.
export const sendContactEmails = internalAction({
  args: {
    name: v.string(),
    email: v.string(),
    telefon: v.optional(v.string()),
    einrichtung: v.optional(v.string()),
    nachricht: v.string(),
    lang: v.string(),
  },
  handler: async (_ctx, args) => {
    const { subject: notifSubject, html: notifHtml } = teamNotification(args);
    const teamResult = await resend.emails.send({
      from: "PeraWays <team@peraways.de>",
      to: ["team@peraways.de"],
      subject: notifSubject,
      html: notifHtml,
    });
    if (teamResult.error) {
      console.error("Resend team notification failed:", JSON.stringify(teamResult.error));
    }

    const { subject: replySubject, html: replyHtml } = autoResponse(args.name, args.lang);
    const replyResult = await resend.emails.send({
      from: "PeraWays <team@peraways.de>",
      to: [args.email],
      subject: replySubject,
      html: replyHtml,
    });
    if (replyResult.error) {
      console.error("Resend auto-response failed:", JSON.stringify(replyResult.error));
    }
  },
});
