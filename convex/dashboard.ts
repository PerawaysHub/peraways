import { query } from "./_generated/server"
import { CANDIDATE_STATUSES } from "./schema"

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const [candidates, contacts] = await Promise.all([
      ctx.db.query("candidates").collect(),
      ctx.db.query("contacts").order("desc").take(100),
    ])

    const statusCounts: { status: string; count: number }[] = CANDIDATE_STATUSES.map((s) => ({
      status: s,
      count: 0,
    }))
    for (const c of candidates) {
      const entry = statusCounts.find((e) => e.status === c.status)
      if (entry) entry.count++
    }

    const recentCandidates = candidates
      .sort((a, b) => b._creationTime - a._creationTime)
      .slice(0, 5)

    const recentContacts = contacts.slice(0, 5)

    const activeStatuses = ["Qualifizierung", "LEA-Fast-Lane", "Visum", "Onboarding / Berlin-Phase"]
    const activePipeline = candidates.filter((c) => activeStatuses.includes(c.status)).length
    const placed = candidates.filter((c) => c.status === "Abgeschlossen").length

    return {
      totalCandidates: candidates.length,
      totalContacts: contacts.length,
      statusCounts,
      activePipeline,
      placed,
      recentCandidates,
      recentContacts,
    }
  },
})
