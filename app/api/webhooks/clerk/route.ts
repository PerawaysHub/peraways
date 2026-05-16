import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;
const adminEmail = process.env.CLERK_ADMIN_EMAIL;
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers.entries());

    const wh = new Webhook(webhookSecret);
    const msg = wh.verify(payload, headers) as Record<string, unknown>;

    const { type, data } = msg;

    if (type === "user.created" || type === "user.updated") {
      const userData = data as {
        id: string;
        first_name?: string;
        last_name?: string;
        email_addresses?: { email_address: string }[];
      };

      const name = [userData.first_name, userData.last_name]
        .filter(Boolean)
        .join(" ");
      const email = userData.email_addresses?.[0]?.email_address || "";
      const role = adminEmail && email === adminEmail ? "admin" : "viewer";

      await convex.mutation(api.users.upsertUser, {
        clerkId: userData.id,
        name,
        email,
        role,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
