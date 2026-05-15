import { query } from "./_generated/server"
import { v } from "convex/values"

export const listByCandidate = query({
  args: { candidateId: v.id("candidates") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("activityLog")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .order("desc")
      .collect()
  },
})
