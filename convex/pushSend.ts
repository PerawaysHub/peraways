"use node"

import webpush from "web-push"
import { v } from "convex/values"
import { internalAction } from "./_generated/server"
import { internal } from "./_generated/api"

webpush.setVapidDetails(
  "mailto:team@peraways.de",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export const sendPushToRecipients = internalAction({
  args: {
    type: v.string(),
    title: v.string(),
    body: v.string(),
    url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const subs = await ctx.runQuery(internal.push.listRecipientSubscriptions, { type: args.type })
    await Promise.all(
      subs.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            JSON.stringify({ title: args.title, body: args.body, url: args.url })
          )
        } catch (err: unknown) {
          const statusCode = (err as { statusCode?: number }).statusCode
          if (statusCode === 404 || statusCode === 410) {
            await ctx.runMutation(internal.push.removeSubscriptionById, { id: sub._id })
          }
        }
      })
    )
  },
})
