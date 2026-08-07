import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET() {
  const { userId, getToken } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const token = await getToken({ template: "convex" })
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  // Instantiated per-request (not a module-level singleton, unlike the other
  // export routes) because setAuth() is stateful — sharing one client across
  // concurrent requests from different logged-in users would risk one
  // request executing under another user's token.
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
  convex.setAuth(token)

  const currentUser = await convex.query(api.users.getCurrentUser)
  if (!currentUser || currentUser.role !== "admin") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  const rows = await convex.query(api.finanzen.listAll)
  if (!rows) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  const headers = ["Talent", "Einrichtung", "Honorarbetrag", "Rabatt", "Status", "Faelligkeitsdatum", "Bezahldatum"]
  const csvRows = rows.map((r) => [
    `"${r.candidateName}"`,
    `"${r.einrichtungName ?? ""}"`,
    r.honorarbetrag,
    r.rabattAngewendet ? "Ja" : "Nein",
    r.status,
    r.faelligkeitsdatum ? new Date(r.faelligkeitsdatum).toLocaleDateString("de-DE") : "",
    r.bezahldatum ? new Date(r.bezahldatum).toLocaleDateString("de-DE") : "",
  ])
  const csv = [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="finanzen-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  })
}
