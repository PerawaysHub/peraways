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
  }).index("by_status", ["status", "position"]),
  candidates: defineTable({
    name: v.string(),
    email: v.string(),
    telefon: v.optional(v.string()),
    status: v.string(),
    position: v.number(),
    notes: v.string(),
    source: v.string(),
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
  }).index("by_status", ["status", "position"]),
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
      v.literal("integrationshelfer")
    ),
  }).index("by_clerkId", ["clerkId"]),
  notifications: defineTable({
    type: v.string(),
    title: v.string(),
    description: v.string(),
    read: v.boolean(),
    relatedId: v.optional(v.string()),
  }).index("by_read", ["read"]),
});
