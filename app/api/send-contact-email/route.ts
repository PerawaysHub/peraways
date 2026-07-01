import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { name, email, telefon, nachricht, lang } = await req.json();

    const subject =
      lang === "de"
        ? "Eingangsbestätigung — PeraWays"
        : "Confirmation of receipt — PeraWays";

    const body =
      lang === "de"
        ? `Hallo ${name},

vielen Dank für Ihre Anfrage bei PeraWays. Wir werden uns innerhalb von 24 Stunden bei Ihnen melden.

Bei dringenden Fragen erreichen Sie uns unter kontakt@peraways.de.

Mit freundlichen Grüßen,
Ihr PeraWays-Team`
        : `Hello ${name},

thank you for your inquiry to PeraWays. We will get back to you within 24 hours.

For urgent matters, please contact us at kontakt@peraways.de.

Best regards,
Your PeraWays Team`;

    const { error } = await resend.emails.send({
      from: "PeraWays <kontakt@peraways.de>",
      replyTo: "kontakt@peraways.de",
      to: email,
      subject,
      text: body,
    });

    if (error) {
      console.error("Auto-response error:", error);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Send email error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
