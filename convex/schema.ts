import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const CANDIDATE_STATUSES = [
  "Qualifizierung",
  "LEA-Fast-Lane",
  "Visum",
  "Onboarding / Berlin-Phase",
  "Abgeschlossen",
] as const;

export const CONTACT_STATUSES = [
  "Neue Anfrage",
  "Kontaktiert",
  "Gespräch",
  "Angebot",
  "Vertrag",
  "Abgeschlossen",
] as const;

export const COMPLIANCE_DOC_TYPES = [
  "ausbildungsvertrag",
  "vorfinanzierungsvereinbarung",
  "erklaerung_beschaeftigungsverhaeltnis",
  "vollmachtskette",
  "reisepass_kopie",
  "geburtsurkunde",
  "kcse_zeugnis",
  "b1_zertifikat",
  "nita_nachweis",
  "wohnraumzusage",
  "schulprognose",
  "uebernahme_arbeitsvertrag",
  "berufsausuebungserlaubnis",
] as const;

export const TERMIN_ARTEN = ["LEA", "Bankeröffnung", "Bürgeramt", "Sonstiges"] as const;

export const FINANZEN_STATUSES = ["Offen", "Fällig", "Bezahlt"] as const;

export const HONORARBETRAG_OPTIONS = ["8500", "8000"] as const;

export const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  editor: "Bearbeiter",
  integrationshelfer: "Integrationshelfer",
  gstc: "GSTC",
  viewer: "Wartet auf Freischaltung",
};

export const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-100 text-red-800",
  editor: "bg-blue-100 text-blue-800",
  integrationshelfer: "bg-purple-100 text-purple-800",
  gstc: "bg-teal-100 text-teal-800",
  viewer: "bg-amber-100 text-amber-800",
};

export const COMPLIANCE_DOC_LABELS: Record<string, string> = {
  ausbildungsvertrag: "Ausbildungsvertrag",
  vorfinanzierungsvereinbarung: "Vorfinanzierungsvereinbarung (Nakuru County)",
  erklaerung_beschaeftigungsverhaeltnis: "Erklärung zum Beschäftigungsverhältnis",
  vollmachtskette: "Vollmachtskette (§81a AufenthG)",
  reisepass_kopie: "Reisepass-Kopie",
  geburtsurkunde: "Geburtsurkunde (beglaubigt)",
  kcse_zeugnis: "KCSE Zeugnis (beglaubigt)",
  b1_zertifikat: "B1-Zertifikat",
  nita_nachweis: "NITA-Nachweis",
  wohnraumzusage: "Wohnraumzusage",
  schulprognose: "Schulprognose (§13 PflFAG)",
  uebernahme_arbeitsvertrag: "Übernahme-Arbeitsvertrag (nach 18 Mon.)",
  berufsausuebungserlaubnis: "Berufsausübungserlaubnis (§1 PflFAG)",
};

// English labels — used by the Talente board / detail page / compliance
// checklist when the DE/EN toggle is set to English (relevant for the
// GSTC partner, who is not a German speaker).
export const CANDIDATE_STATUS_LABELS_EN: Record<string, string> = {
  Qualifizierung: "Qualification",
  "LEA-Fast-Lane": "LEA Fast-Lane",
  Visum: "Visa",
  "Onboarding / Berlin-Phase": "Onboarding / Berlin Phase",
  Abgeschlossen: "Completed",
};

export const COMPLIANCE_DOC_LABELS_EN: Record<string, string> = {
  ausbildungsvertrag: "Training Contract",
  vorfinanzierungsvereinbarung: "Pre-Financing Agreement (Nakuru County)",
  erklaerung_beschaeftigungsverhaeltnis: "Employment Relationship Declaration",
  vollmachtskette: "Chain of Authorization (§81a AufenthG)",
  reisepass_kopie: "Passport Copy",
  geburtsurkunde: "Birth Certificate (certified)",
  kcse_zeugnis: "KCSE Certificate (certified)",
  b1_zertifikat: "B1 Certificate",
  nita_nachweis: "NITA Proof",
  wohnraumzusage: "Housing Confirmation",
  schulprognose: "School Prognosis (§13 PflFAG)",
  uebernahme_arbeitsvertrag: "Takeover Employment Contract (after 18 mo.)",
  berufsausuebungserlaubnis: "Professional Practice Permit (§1 PflFAG)",
};

export default defineSchema({
  contacts: defineTable({
    name: v.string(),
    email: v.string(),
    telefon: v.optional(v.string()),
    einrichtung: v.optional(v.string()),
    nachricht: v.string(),
    lang: v.string(),
    status: v.optional(v.string()),
    position: v.optional(v.number()),
    deletedAt: v.optional(v.number()),
    ansprechpartnerName: v.optional(v.string()),
    ansprechpartnerEmail: v.optional(v.string()),
    ansprechpartnerTelefon: v.optional(v.string()),
    rahmenvertragUnterschrieben: v.optional(v.boolean()),
    adresse: v.optional(v.string()),
  }).index("by_status", ["status", "position"]),
  candidates: defineTable({
    name: v.string(),
    email: v.string(),
    telefon: v.optional(v.string()),
    status: v.string(),
    position: v.number(),
    notes: v.string(),
    lang: v.string(),
    deletedAt: v.optional(v.number()),
    geburtsdatum: v.optional(v.number()),
    passnummer: v.optional(v.string()),
    herkunftsland: v.optional(v.string()),
    b1Status: v.optional(
      v.union(
        v.literal("In Ausbildung"),
        v.literal("Bestanden"),
        v.literal("Nicht gestartet")
      )
    ),
    datumB1Pruefung: v.optional(v.number()),
    aktuellerSprachkurs: v.optional(v.string()),
    flugdatum: v.optional(v.number()),
    landungsdatumBerlin: v.optional(v.number()),
    ablaufdatumVisum: v.optional(v.number()),
    ersterArbeitstag: v.optional(v.number()),
    avatarStorageId: v.optional(v.id("_storage")),
    einrichtungId: v.optional(v.id("contacts")),
  })
    .index("by_status", ["status", "position"])
    .index("by_einrichtung", ["einrichtungId"]),
  complianceDocuments: defineTable({
    candidateId: v.id("candidates"),
    docType: v.string(),
    status: v.union(v.literal("Erhalten"), v.literal("Fehlt")),
    storageId: v.optional(v.id("_storage")),
    uploadedAt: v.optional(v.number()),
  })
    .index("by_candidate", ["candidateId"])
    .index("by_candidate_and_type", ["candidateId", "docType"]),
  documents: defineTable({
    candidateId: v.id("candidates"),
    name: v.string(),
    type: v.string(),
    storageId: v.id("_storage"),
    uploadedAt: v.number(),
  }).index("by_candidate", ["candidateId"]),
  termine: defineTable({
    candidateId: v.id("candidates"),
    datum: v.number(),
    uhrzeit: v.string(),
    art: v.union(
      v.literal("LEA"),
      v.literal("Bankeröffnung"),
      v.literal("Bürgeramt"),
      v.literal("Sonstiges")
    ),
    status: v.union(v.literal("Offen"), v.literal("Erledigt")),
    notizen: v.optional(v.string()),
  })
    .index("by_candidate", ["candidateId"])
    .index("by_datum", ["datum"]),
  finanzen: defineTable({
    candidateId: v.id("candidates"),
    honorarbetrag: v.union(v.literal("8500"), v.literal("8000")),
    rabattAngewendet: v.boolean(),
    status: v.union(v.literal("Offen"), v.literal("Fällig"), v.literal("Bezahlt")),
    faelligkeitsdatum: v.optional(v.number()),
    bezahldatum: v.optional(v.number()),
  }).index("by_candidate", ["candidateId"]),
  activityLog: defineTable({
    candidateId: v.id("candidates"),
    type: v.string(),
    description: v.string(),
    timestamp: v.number(),
  }).index("by_candidate", ["candidateId"]),
  users: defineTable({
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
  }).index("by_clerkId", ["clerkId"]),
  notifications: defineTable({
    type: v.string(),
    title: v.string(),
    description: v.string(),
    read: v.boolean(),
    relatedId: v.optional(v.string()),
  }).index("by_read", ["read"]),
  pushSubscriptions: defineTable({
    userId: v.id("users"),
    endpoint: v.string(),
    p256dh: v.string(),
    auth: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_endpoint", ["endpoint"]),
});
