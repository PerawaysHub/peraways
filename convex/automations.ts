import { internalAction } from "./_generated/server"
import { internal, api } from "./_generated/api"

export const runAbendBot = internalAction({
  args: {},
  handler: async (ctx) => {
    const berlinHour = new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Berlin",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(new Date())
    if (berlinHour !== "18") return

    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000

    const termine = await ctx.runQuery(api.termine.listToday, { startOfDay, endOfDay })
    const offenTermine = termine.filter((t) => t.status === "Offen")
    if (offenTermine.length === 0) return

    const recipients = await ctx.runQuery(internal.users.listRecipientEmails, {})
    await ctx.runAction(internal.sendEmails.sendAbendBotEmail, {
      termine: offenTermine.map((t) => ({
        candidateName: t.candidateName,
        uhrzeit: t.uhrzeit,
        art: t.art,
      })),
      recipients,
    })
  },
})
