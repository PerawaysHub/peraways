import { query, mutation, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

// Which roles a given notification type is relevant to. gstc and viewer are
// never included: gstc gets no internal team notifications at all, and
// viewer is the not-yet-approved waiting state. "new_user_registered" is
// admin-only since only an admin can act on it (approve the registration) —
// editor/integrationshelfer can technically browse the read-only Nutzer
// page, but the notification itself isn't actionable for them.
export function eligibleRolesFor(type: string): string[] {
  if (type === "new_user_registered") return ["admin"];
  return ["admin", "editor", "integrationshelfer"];
}

async function getCurrentRole(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
    .unique();
  return user?.role ?? null;
}

export const listUnread = query({
  args: {},
  handler: async (ctx) => {
    const role = await getCurrentRole(ctx);
    if (!role) return [];
    const unread = await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("read"), false))
      .order("desc")
      .collect();
    return unread.filter((n) => eligibleRolesFor(n.type).includes(role));
  },
});

export const countUnread = query({
  args: {},
  handler: async (ctx) => {
    const role = await getCurrentRole(ctx);
    if (!role) return 0;
    const notifications = await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("read"), false))
      .collect();
    return notifications.filter((n) => eligibleRolesFor(n.type).includes(role)).length;
  },
});

export const markAsRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { read: true });
  },
});

export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const role = await getCurrentRole(ctx);
    if (!role) return;
    const unread = await ctx.db
      .query("notifications")
      .filter((q) => q.eq(q.field("read"), false))
      .collect();
    const visible = unread.filter((n) => eligibleRolesFor(n.type).includes(role));
    await Promise.all(visible.map((n) => ctx.db.patch(n._id, { read: true })));
  },
});
