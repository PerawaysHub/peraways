function templateWrapper(body: string, lang: string): string {
  const isDE = lang === "de"
  return `<!DOCTYPE html>
<html lang="${lang}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body { margin:0; padding:0; font-family:Outfit,system-ui,sans-serif; background:#f7f7f7; }
  .container { max-width:560px; margin:0 auto; padding:32px 24px; }
  .card { background:#fff; border:1px solid #e5e7eb; padding:32px; }
  .logo { font-size:24px; font-weight:700; color:#19463C; letter-spacing:-0.02em; margin:0 0 24px; }
  h2 { font-size:18px; font-weight:700; color:#111; margin:0 0 12px; }
  p { font-size:14px; line-height:1.6; color:#555; margin:0 0 12px; }
  .label { font-size:11px; font-weight:600; color:#999; text-transform:uppercase; letter-spacing:0.5px; margin:16px 0 4px; }
  .value { font-size:14px; color:#111; margin:0 0 4px; }
  hr { border:none; border-top:1px solid #e5e7eb; margin:24px 0; }
  .footer { font-size:12px; color:#999; text-align:center; margin-top:24px; }
</style>
</head>
<body>
<div class="container">
  <div class="card">
    <div class="logo">PeraWays</div>
    ${body}
  </div>
  <div class="footer">
    ${isDE ? "PeraWays UG — Berlin" : "PeraWays UG — Berlin"}<br>
    ${isDE ? "info@peraways.de" : "info@peraways.de"}
  </div>
</div>
</body>
</html>`
}

export function autoResponse(name: string, lang: string): { subject: string; html: string } {
  const isDE = lang === "de"
  const subject = isDE
    ? "Wir haben Ihre Nachricht erhalten — PeraWays"
    : "We received your message — PeraWays"

  const body = isDE ? `
    <h2>Hallo ${name},</h2>
    <p>vielen Dank für Ihre Nachricht. Wir haben Ihre Anfrage erhalten und werden uns innerhalb der nächsten 24 Stunden bei Ihnen melden.</p>
    <p>Falls Sie ein dringendes Anliegen haben, erreichen Sie uns direkt unter <strong>info@peraways.de</strong>.</p>
    <hr>
    <p style="font-size:13px;color:#999;">Mit freundlichen Grüßen<br>Ihr PeraWays-Team</p>
  ` : `
    <h2>Hello ${name},</h2>
    <p>thank you for your message. We have received your inquiry and will get back to you within the next 24 hours.</p>
    <p>If you have an urgent matter, you can reach us directly at <strong>info@peraways.de</strong>.</p>
    <hr>
    <p style="font-size:13px;color:#999;">Best regards<br>Your PeraWays Team</p>
  `

  return { subject, html: templateWrapper(body, lang) }
}

export function teamNotification(data: {
  name: string
  email: string
  telefon?: string
  nachricht: string
  lang: string
}): { subject: string; html: string } {
  const isDE = data.lang === "de"
  const subject = isDE
    ? `Neue Kontaktanfrage von ${data.name}`
    : `New contact inquiry from ${data.name}`

  const body = `
    <h2>${isDE ? "Neue Kontaktanfrage" : "New Contact Inquiry"}</h2>
    <div class="label">${isDE ? "Name" : "Name"}</div>
    <div class="value">${data.name}</div>
    <div class="label">Email</div>
    <div class="value">${data.email}</div>
    ${data.telefon ? `
    <div class="label">${isDE ? "Telefon" : "Phone"}</div>
    <div class="value">${data.telefon}</div>
    ` : ""}
    <div class="label">${isDE ? "Sprache" : "Language"}</div>
    <div class="value">${data.lang.toUpperCase()}</div>
    <div class="label">${isDE ? "Nachricht" : "Message"}</div>
    <div class="value">${data.nachricht}</div>
  `

  return { subject, html: templateWrapper(body, data.lang) }
}
