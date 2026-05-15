import { query } from "./_generated/server"
import { CANDIDATE_STATUSES } from "./schema"

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const [candidates, contacts] = await Promise.all([
      ctx.db.query("candidates").collect(),
      ctx.db.query("contacts").order("desc").take(100),
    ])

    const candidatesByStatus: Record<string, number> = {}
    for (const s of CANDIDATE_STATUSES) candidatesByStatus[s] = 0
    for (const c of candidates) {
      if (candidatesByStatus[c.status] !== undefined) candidatesByStatus[c.status]++
    }

    const recentCandidates = candidates
      .sort((a, b) => b._creationTime - a._creationTime)
      .slice(0, 5)

    const recentContacts = contacts.slice(0, 5)

    const activeStatuses = ["Neue Bewerbung", "Kontaktiert", "Gespräch", "Angebot", "Visum"]
    const activePipeline = candidates.filter((c) => activeStatuses.includes(c.status)).length
    const placed = candidates.filter((c) => c.status === "Gestartet").length

    return {
      totalCandidates: candidates.length,
      totalContacts: contacts.length,
      candidatesByStatus,
      activePipeline,
      placed,
      recentCandidates,
      recentContacts,
    }
  },
})
