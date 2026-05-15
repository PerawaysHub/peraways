import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import { NextResponse } from "next/server"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function GET() {
  try {
    const candidates = await convex.query(api.candidates.list)
    const statuses = ["Neue Bewerbung", "Kontaktiert", "Gespräch", "Angebot", "Visum", "Gestartet"]

    const headers = ["Name", "Email", "Telefon", "Status", "Source", "Language", "Created"]
    const rows = candidates.map((c: any) => [
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.telefon || ""}"`,
      `"${c.status}"`,
      `"${c.source || ""}"`,
      c.lang?.toUpperCase() || "DE",
      new Date(c._creationTime).toLocaleDateString("de-DE"),
    ])

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="candidates-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch {
    return NextResponse.json({ error: "Failed to export" }, { status: 500 })
  }
}
