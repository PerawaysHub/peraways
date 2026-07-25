import { QueryCtx, MutationCtx } from "./_generated/server";

export async function getCurrentUserRole(
  ctx: QueryCtx | MutationCtx
): Promise<string | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
    .unique();
  return user?.role ?? null;
}

export async function requireAdmin(ctx: MutationCtx): Promise<void> {
  const role = await getCurrentUserRole(ctx);
  if (role !== "admin") throw new Error("Not authorized");
}
