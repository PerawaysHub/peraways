import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { renderToBuffer } from "@react-pdf/renderer"
import { readFile } from "fs/promises"
import path from "path"
import { AnschreibenDocument } from "@/lib/pdf/anschreiben"
import type { Id } from "@/convex/_generated/dataModel"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

function formatDate(timestamp: number | undefined) {
  if (!timestamp) return "—"
  return new Date(timestamp).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" })
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const { id } = await params
  const candidate = await convex.query(api.candidates.getById, { id: id as Id<"candidates"> })
  if (!candidate) {
    return NextResponse.json({ error: "Talent nicht gefunden" }, { status: 404 })
  }

  const einrichtung = candidate.einrichtungId
    ? await convex.query(api.contacts.getById, { id: candidate.einrichtungId })
    : null

  const logoIcon = await readFile(path.join(process.cwd(), "public/icons/icon-512.png"))

  const pdfBuffer = await renderToBuffer(
    AnschreibenDocument({
      logoIcon,
      data: {
        name: candidate.name,
        geburtsdatum: formatDate(candidate.geburtsdatum),
        passnummer: candidate.passnummer || "—",
        herkunftsland: candidate.herkunftsland || "—",
        traegerName: einrichtung?.einrichtung || einrichtung?.name || "—",
        traegerAdresse: einrichtung?.adresse || "—",
        ausbildungsbeginn: formatDate(candidate.ersterArbeitstag),
        datum: formatDate(Date.now()),
      },
    })
  )

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Anschreiben-${candidate.name.replace(/[^a-zA-Z0-9]+/g, "-")}.pdf"`,
    },
  })
}
