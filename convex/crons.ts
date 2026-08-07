import { cronJobs } from "convex/server"
import { internal } from "./_generated/api"

const crons = cronJobs()

crons.hourly(
  "abend-bot-check",
  { minuteUTC: 0 },
  internal.automations.runAbendBot
)

crons.daily(
  "honorar-faelligkeits-waechter",
  { hourUTC: 5, minuteUTC: 0 },
  internal.finanzen.checkFaelligkeit
)

crons.daily(
  "honorar-ueberfaellig-reminder",
  { hourUTC: 5, minuteUTC: 30 },
  internal.automations.runFaelligkeitReminder
)

export default crons
