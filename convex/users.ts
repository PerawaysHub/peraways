import { query, mutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const listRecipientEmails = internalQuery({
  args: {},
  handler: async (ctx) => {
    const helpers = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "integrationshelfer"))
      .collect();
    const emails = helpers.map((u) => u.email).filter((e) => e && e.length > 0);
    return emails.length > 0 ? emails : ["team@peraways.de"];
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    return user;
  },
});

export const upsertUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("admin"),
      v.literal("viewer"),
      v.literal("editor"),
      v.literal("integrationshelfer"),
      v.literal("gstc")
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existing) {
      // Deliberately does not touch `role` here — this mutation is also called
      // on every Clerk "user.updated" webhook event (profile edits, etc.), and
      // overwriting the admin-assigned role on each of those would silently
      // reset anyone back to the webhook's default computed role.
      await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
      });
      return existing._id;
    }

    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      role: args.role,
    });

    await ctx.db.insert("notifications", {
      type: "new_user_registered",
      title: "Neue Registrierung",
      description: `${args.name || args.email} hat sich registriert und wartet auf Freischaltung.`,
      read: false,
      relatedId: userId,
    });

    await ctx.scheduler.runAfter(0, internal.sendEmails.sendNewUserEmail, {
      name: args.name,
      email: args.email,
    });

    await ctx.scheduler.runAfter(0, internal.pushSend.sendPushToRecipients, {
      type: "new_user_registered",
      title: "Neue Registrierung",
      body: `${args.name || args.email} wartet auf Freischaltung.`,
      url: "/dashboard/users",
    });

    return userId;
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(
      v.literal("admin"),
      v.literal("viewer"),
      v.literal("editor"),
      v.literal("integrationshelfer"),
      v.literal("gstc")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.userId, { role: args.role });
  },
});

export const remove = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser || currentUser.role !== "admin") {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.userId);
  },
});

// Called by the Clerk webhook on "user.deleted" (e.g. someone deletes their
// own account via Manage Account) — no admin check, since this is only ever
// invoked from the trusted server-to-server webhook route, not from a client.
export const deleteByClerkId = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
    if (user) await ctx.db.delete(user._id);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    const viewRoles = ["admin", "editor", "integrationshelfer"];
    if (!currentUser || !viewRoles.includes(currentUser.role)) return [];

    return await ctx.db.query("users").collect();
  },
});
